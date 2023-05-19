---
title: LuaSnip的特殊全局snippet
date: 2023-05-19 23:22:46
categories:
    - GPT
    - Lua
tags:
    - 编程
---

# Zoran

介绍以下一下代码中, 是如何设置加载的全局变量的呢:

-- loads snippets from directory structured almost like snipmate-collection:
-- - files all named <ft>.lua
-- - each returns table containing keys (optional) "snippets" and
-- "autosnippets", value for each a list of snippets.
--
-- cache:
-- - lazy_load_paths: {
-- {
-- add_opts = {...},
-- ft1 = {filename1, filename2},
-- ft2 = {filename1},
-- ...
-- }, {
-- add_opts = {...},
-- ft1 = {filename1},
-- ...
-- }
-- }
--
-- each call to load generates a new entry in that list. We cannot just merge
-- all files for some ft since add_opts might be different (they might be from
-- different lazy_load-calls).

local cache = require("luasnip.loaders.\_caches").lua
local path_mod = require("luasnip.util.path")
local loader_util = require("luasnip.loaders.util")
local ls = require("luasnip")
local log = require("luasnip.util.log").new("lua-loader")
local session = require("luasnip.session")
local util = require("luasnip.util.util")

local M = {}

-- ASSUMPTION: this function will only be called inside the snippet-constructor,
-- to find the location of the lua-loaded file calling it.
-- It is not exported, because it will (in its current state) only ever be used
-- in one place, and it feels a bit wrong to expose put a function into `M`.
-- Instead, it is inserted into the global environment before a luasnippet-file
-- is loaded, and removed from it immediately when this is done
local function get_loaded_file_debuginfo()
-- we can skip looking at the first four stackframes, since
-- 1 is this function
-- 2 is the snippet-constructor
-- ... (here anything is going on, could be 0 stackframes, could be many)
-- n-2 (at least 3) is the loaded file
-- n-1 (at least 4) is pcall
-- n (at least 5) is \_luasnip_load_files
local current_call_depth = 4
local debuginfo

    repeat
    	current_call_depth = current_call_depth + 1
    	debuginfo = debug.getinfo(current_call_depth, "n")
    until debuginfo.name == "_luasnip_load_files"

    -- ret is stored into a local, and not returned immediately to prevent tail
    -- call optimization, which seems to invalidate the stackframe-numbers
    -- determined earlier.
    --
    -- current_call_depth-0 is _luasnip_load_files,
    -- current_call_depth-1 is pcall, and
    -- current_call_depth-2 is the lua-loaded file.
    -- "Sl": get only source-file and current line.
    local ret = debug.getinfo(current_call_depth - 2, "Sl")
    return ret

end

local function _luasnip_load_files(ft, files, add_opts)
for _, file in ipairs(files) do
-- vim.loader.enabled does not seem to be official api, so always reset
-- if the loader is available.
-- To be sure, even pcall it, in case there are conditions under which
-- it might error.
if vim.loader then
-- pcall, not sure if this can fail in some way..
-- Does not seem like it though
local ok, res = pcall(vim.loader.reset, file)
if not ok then
log.warn("Could not reset cache for file %s\n: %s", file, res)
end
end

    	local func, error_msg = loadfile(file)
    	if error_msg then
    		log.error("Failed to load %s\n: %s", file, error_msg)
    		error(string.format("Failed to load %s\n: %s", file, error_msg))
    	end

    	-- the loaded file may add snippets to these tables, they'll be
    	-- combined with the snippets returned regularly.
    	local file_added_snippets = {}
    	local file_added_autosnippets = {}

    	-- setup snip_env in func
    	local func_env = vim.tbl_extend(
    		"force",
    		-- extend the current(expected!) globals with the snip_env, and the
    		-- two tables.
    		_G,
    		ls.get_snip_env(),
    		{
    			ls_file_snippets = file_added_snippets,
    			ls_file_autosnippets = file_added_autosnippets,
    		}
    	)
    	-- defaults snip-env requires metatable for resolving
    	-- lazily-initialized keys. If we have to combine this with an eventual
    	-- metatable of _G, look into unifying ls.setup_snip_env and this.
    	setmetatable(func_env, getmetatable(ls.get_snip_env()))
    	setfenv(func, func_env)

    	-- Since this function has to reach the snippet-constructor, and fenvs
    	-- aren't inherited by called functions, we have to set it in the global
    	-- environment.
    	_G.__luasnip_get_loaded_file_frame_debuginfo = util.ternary(
    		session.config.loaders_store_source,
    		get_loaded_file_debuginfo,
    		nil
    	)
    	local run_ok, file_snippets, file_autosnippets = pcall(func)
    	-- immediately nil it.
    	_G.__luasnip_get_loaded_file_frame_debuginfo = nil

    	if not run_ok then
    		log.error("Failed to execute\n: %s", file, file_snippets)
    		error("Failed to execute " .. file .. "\n: " .. file_snippets)
    	end

    	-- make sure these aren't nil.
    	file_snippets = file_snippets or {}
    	file_autosnippets = file_autosnippets or {}

    	vim.list_extend(file_snippets, file_added_snippets)
    	vim.list_extend(file_autosnippets, file_added_autosnippets)

    	-- keep track of snippet-source.
    	cache.path_snippets[file] = {
    		add_opts = add_opts,
    		ft = ft,
    	}

    	ls.add_snippets(
    		ft,
    		file_snippets,
    		vim.tbl_extend("keep", {
    			type = "snippets",
    			key = "__snippets_" .. file,
    			-- prevent refresh here, will be done outside loop.
    			refresh_notify = false,
    		}, add_opts)
    	)
    	ls.add_snippets(
    		ft,
    		file_autosnippets,
    		vim.tbl_extend("keep", {
    			type = "autosnippets",
    			key = "__autosnippets_" .. file,
    			-- prevent refresh here, will be done outside loop.
    			refresh_notify = false,
    		}, add_opts)
    	)
    	log.info(
    		"Adding %s snippets and %s autosnippets from %s to ft `%s`",
    		#file_snippets,
    		#file_autosnippets,
    		file,
    		ft
    	)
    end

    ls.refresh_notify(ft)

end

function M._load_lazy_loaded_ft(ft)
for _, load_call_paths in ipairs(cache.lazy_load_paths) do
\_luasnip_load_files(
ft,
load_call_paths[ft] or {},
load_call_paths.add_opts
)
end
end

function M.\_load_lazy_loaded(bufnr)
local fts = loader_util.get_load_fts(bufnr)

    for _, ft in ipairs(fts) do
    	if not cache.lazy_loaded_ft[ft] then
    		log.info("Loading lazy-load-snippets for filetype `%s`", ft)
    		M._load_lazy_loaded_ft(ft)
    		cache.lazy_loaded_ft[ft] = true
    	end
    end

end

function M.load(opts)
opts = opts or {}

    local add_opts = loader_util.add_opts(opts)

    local collections =
    	loader_util.get_load_paths_snipmate_like(opts, "luasnippets", "lua")
    for _, collection in ipairs(collections) do
    	local load_paths = collection.load_paths
    	log.info("Loading snippet-collection:\n%s", vim.inspect(load_paths))

    	-- also add files from collection to cache (collection of all loaded
    	-- files by filetype, useful for editing files for some filetype).
    	loader_util.extend_ft_paths(cache.ft_paths, load_paths)

    	for ft, files in pairs(load_paths) do
    		_luasnip_load_files(ft, files, add_opts)
    	end
    end

end

function M.lazy_load(opts)
opts = opts or {}

    local add_opts = loader_util.add_opts(opts)

    local collections =
    	loader_util.get_load_paths_snipmate_like(opts, "luasnippets", "lua")
    for _, collection in ipairs(collections) do
    	local load_paths = collection.load_paths

    	loader_util.extend_ft_paths(cache.ft_paths, load_paths)

    	for ft, files in pairs(load_paths) do
    		if cache.lazy_loaded_ft[ft] then
    			-- instantly load snippets if they were already loaded...
    			log.info(
    				"Immediately loading lazy-load-snippets for already-active filetype `%s` from files:\n%s",
    				ft,
    				vim.inspect(files)
    			)
    			_luasnip_load_files(ft, files, add_opts)

    			-- don't load these files again.
    			load_paths[ft] = nil
    		end
    	end

    	log.info("Registering lazy-load-snippets:\n%s", vim.inspect(load_paths))

    	load_paths.add_opts = add_opts
    	table.insert(cache.lazy_load_paths, load_paths)
    end

    -- load for current buffer on startup.
    M._load_lazy_loaded(vim.api.nvim_get_current_buf())

end

-- Make sure filename is normalized
function M.\_reload_file(filename)
local file_cache = cache.path_snippets[filename]
-- only clear and load(!!! snippets may not actually be loaded, lazy_load)
-- if the snippets were really loaded.
-- normally file_cache should exist if the autocommand was registered, just
-- be safe here.
if file_cache then
local add_opts = file_cache.add_opts
local ft = file_cache.ft

    	log.info("Re-loading snippets contributed by %s", filename)
    	_luasnip_load_files(ft, { filename }, add_opts)
    	ls.clean_invalidated({ inv_limit = 100 })
    end

end

function M.edit_snippet_files()
loader_util.edit_snippet_files(cache.ft_paths)
end

return M

## Response

这段代码来自于 LuaSnip，一个用于 Neovim 的代码片段插件，支持文本或代码片段的插入。在这段代码中，全局变量被用于储存和管理代码片段信息。

首先，全局变量主要储存在 `cache` 中，这是一个 Lua 模块。它保存了关于 Lua 加载器的信息，包括路径（ `lazy_load_paths` ）、文件类型（ `ft` ）等。每当加载新的代码片段时，这个 `cache` 就会被更新。

对于加载的全局变量，它们主要在函数 `_luasnip_load_files(ft, files, add_opts)` 中被设置。这个函数从指定的文件中加载代码片段，并将其添加到全局环境中。这主要通过两个步骤实现：

1. 通过 `loadfile(file)` 加载文件并返回一个可以执行的函数。如果加载失败，将记录错误信息。

2. 设置函数的环境（ `func_env` ）。这个环境包括当前的全局环境（ `_G` ）、代码片段环境（ `ls.get_snip_env()` ），以及从文件中添加的代码片段和自动代码片段。这个环境被设为函数的第一环境。

然后，这个函数会在全局环境中设置一个特殊的变量 `__luasnip_get_loaded_file_frame_debuginfo` 。这个变量是一个函数，它用于在构造代码片段时获取调用它的 Lua 文件的调试信息。然后，执行函数，加载代码片段，并在执行完毕后立即将这个全局变量设为 `nil` 。

此外，还有两个函数 `M._load_lazy_loaded_ft(ft)` 和 `M._load_lazy_loaded(bufnr)` ，它们分别处理延迟加载的文件类型和缓冲区。

另外， `M.load(opts)` 和 `M.lazy_load(opts)` 函数用于加载或延迟加载指定的代码片段集合。它们首先获取加载路径和选项，然后对每一个文件类型和文件，调用 `_luasnip_load_files(ft, files, add_opts)` 函数来加载代码片段。

最后， `M._reload_file(filename)` 和 `M.edit_snippet_files()` 函数分别用于重新加载指定的文件，和编辑当前文件类型的所有代码片段文件。

整体来看，这段代码主要是在处理 LuaSnip 的代码片段加载，包括直接加载和延迟加载，以及文件的重新加载和编辑。全局变量在这里主要被用于储存和管理这些代码片段的信息。

---

# Zoran

他是如何设置函数的环境的, 请你详细介绍一下这部分的逻辑

## Response

在 Lua 中，每个函数都有自己的环境，即一组变量的集合。在这段代码中，函数的环境通过以下步骤进行设置：

1. 创建环境表：在 `_luasnip_load_files(ft, files, add_opts)` 函数中，首先创建了一个名为 `func_env` 的新表。这个表是通过 `vim.tbl_extend` 函数创建的，该函数将多个表合并在一起。这里合并了全局环境（ `_G` ）、代码片段环境（由 `ls.get_snip_env()` 返回），以及两个新的表 `ls_file_snippets` 和 `ls_file_autosnippets` ，这两个新表被初始化为空表，将在加载文件时填充代码片段。

2. 设置元表：在 Lua 中，一个表的元表可以定义该表的一些特殊行为，例如索引未定义的键。在这里，通过 `setmetatable(func_env, getmetatable(ls.get_snip_env()))` 设置了 `func_env` 的元表。这里的元表是从代码片段环境中获取的，这意味着 `func_env` 将继承代码片段环境的特殊行为。

3. 应用环境：最后，通过 `setfenv(func, func_env)` 将 `func_env` 设置为 `func` 的环境。 `setfenv` 是一个内置的 Lua 函数，用于设置函数的环境。这意味着在 `func` 中，全局变量将来自于 `func_env` ，而不是默认的全局环境。

因此，这个函数的环境包含了全局环境、代码片段环境，以及可能从文件中加载的代码片段。这样，当执行这个函数时，它可以访问到这些环境中的所有变量，并且可以添加新的代码片段到 `ls_file_snippets` 和 `ls_file_autosnippets` 表中。

---
