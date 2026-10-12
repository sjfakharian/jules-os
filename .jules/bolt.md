## 2024-10-08 - [RegExp compilation in filesystem iteration]
**Learning:** Found a common anti-pattern where a file filtering loop (`isInfraFilename`) compiled dynamic regular expressions using `new RegExp` for every file scanned against globs containing `*`. When iterating over thousands of files in a codebase, compiling regexes per iteration becomes a serious CPU bottleneck.
**Action:** Implemented a caching mechanism using `Map<string, RegExp>` for compiled regular expressions, enabling reuse of regex objects and significantly improving the performance of operations like `scanActiveHygiene`. Check for repeated `new RegExp` calls within generic directory-walking logic next time.

## 2024-05-19 - O(N) Array Allocation in String Slicing
**Learning:** String splitting (`stdout.split("\n")`) just to extract the first `n` lines creates a massive intermediate array in memory, causing significant CPU and GC pressure for large command outputs (e.g. git logs or shell execution results). This is an O(N) allocation bottleneck where N is the total number of lines in the output.
**Action:** Use `indexOf('\n')` in a loop to find the precise byte offset of the `n`th line, and then use `slice(0, index)`. This is a zero-allocation operation (O(M) where M is the number of characters in the first `n` lines) and is orders of magnitude faster for huge outputs.

## 2024-10-12 - Vault-scale File Traversal Bottlenecks
**Learning:** In codebases doing large, bounded synchronous walks (like `visibleFiles` iterating thousands of markdown notes), calling `readdirSync(dir)` followed by `lstatSync(file)` inside the loop creates massive system call overhead. On slower filesystems or large vaults, this is a significant bottleneck.
**Action:** Always pass `{ withFileTypes: true }` to `readdirSync` or `readdir`. This yields `Dirent` objects which already know if they are a file, directory, or symlink, skipping the `lstat` syscall entirely for standard files and directories.
