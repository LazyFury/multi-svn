import { invoke } from '@tauri-apps/api/tauri'

export type CommandlineOutput = {
    stdout: string,
    stderr: string,
    status: number
}

class CommandlineResult<T = any> {
    output?: CommandlineOutput

    constructor(output: CommandlineOutput) {
        this.output = output
    }

    format() {
        let lines = this.output?.stdout.split("\n") || []
        let info: { [key: string]: unknown } = {} // add a string index signature to info
        for (let line of lines) {
            let [key, ...vals] = line.split(":")
            let value = vals.join(":").trim()
            key = key.trim()
            key = key.replace(/\s/g, "_")
            if (value) value = value.trim()
            if (key) info[key] = value // use the string index signature to access info
        }
        return info as T // type assertion to return info as T
    }
}

export type SvnInfo = {
    /**
     * The URL of the repository.
     */
    Last_Changed_Author: string,
    /**
     * The date the item was last changed.
     */
    Last_Changed_Date: string,
    /**
     * The revision of the item's last change.
     */
    Last_Changed_Rev: string,
    /**
     * The kind of the item (file, dir, etc.).
     */
    Node_Kind: string,
    /**
     * The path to the item relative to the repository root URL.
     */
    Relative_URL: string,
    /**
     * The root URL of the repository.
     */
    Repository_Root: string,
    /**
     * The last revision this item appeared in.
     */
    Revision: string,
    /**
     * The node's schedule (normal, add, delete, replace).
     */
    URL: string,
    Repository_UUID: string,
    /**
     * The path to the item on disk.
     */
    Working_Copy_Root_Path: string,
    Schedule: string,
}

/**
 * Path: hello
URL: svn://127.0.0.1/hello
Relative URL: ^/hello
Repository Root: svn://127.0.0.1
Repository UUID: 211b5685-5bab-4064-9049-6ac05a783794
Revision: 8
Node Kind: directory
Last Changed Author: suke
Last Changed Rev: 6
Last Changed Date: 2023-10-03 20:47:20 +0800 (二, 03 10 2023)
 */
type SvnServeInfo = {
    Path: string,
    URL: string,
    Relative_URL: string,
    Repository_Root: string,
    Repository_UUID: string,
    Revision: string,
    Node_Kind: string,
    Last_Changed_Author: string,
    Last_Changed_Rev: string,
    Last_Changed_Date: string,
}


export class SvnUtils {
    static program = "/opt/subversion/bin/svn";
    static root = "/";//some command no work path use root

    static async command(dir: string, ...args: string[]) {
        let output = await invoke<CommandlineOutput>('run', {
            program: this.program,
            args,
            dir
        })

        console.log("SvnUtils:", output)

        return output;
    }

    static async isWorkingCopy(dir: string) {
        let output = await this.command(dir, "info")
        return output.status == 0 && output.stdout !== ""
    }

    static async info(dir: string) {
        return new CommandlineResult<SvnInfo>(await this.command(dir, "info"))
    }


    static async status(dir: string) {
        return this.command(dir, "status")
    }

    // is Clean
    static async isClean(dir: string) {
        let output = await this.status(dir)
        return output.stdout === ""
    }

    // change file list 
    static async changeFileList(dir: string) {
        let output = await this.status(dir)
        let lines = output.stdout.split("\n")
        let files: object[] = []
        for (let line of lines) {
            let file = line.trim()
            let split = file.split(" ")
            let status = split[0];
            let f = split[split.length - 1];
            let text = this.statusToText(status)
            let emoji = this.statusToEmoji(status)
            if (file) files.push({
                status, text,
                file: f,
                emoji
            })
        }

        return files
    }

    // svn file status to text 
    static statusToText(status: string) {
        switch (status) {
            case "A": return "Added"
            case "C": return "Conflicted"
            case "D": return "Deleted"
            case "I": return "Ignored"
            case "M": return "Modified"
            case "R": return "Replaced"
            case "X": return "External"
            case "?": return "Not Controlled"
            case "!": return "Missing"
            case "~": return "Obstructed"
            case "L": return "Locked"
            case "E": return "Exist"
            case "T": return "Tree Conflicted"
            default: return "Unknown"
        }
    }

    // svn file status to emoji icon 
    static statusToEmoji(status: string) {
        switch (status) {
            case "A": return "📝"
            case "C": return "🔥"
            case "D": return "🗑️"
            case "I": return "🤔"
            case "M": return "✏️"
            case "R": return "🔄"
            case "X": return "📦"
            case "?": return "ℹ️"
            case "!": return "🚫"
            case "~": return "🚧"
            case "L": return "🔒"
            case "E": return "🆗"
            case "T": return "🌲"
            default: return "🤷"
        }
    }

    /**
     *  file status action array 
     *  ? = add,delete,ignore
     *  A = commit
     */
    static statusAction(status: string) {
        switch (status) {
            case "A": return ["commit"]
            case "C": return []
            case "D": return ["commit"]
            case "I": return []
            case "M": return ["commit"]
            case "R": return ["commit"]
            case "X": return []
            case "?": return ["add", "delete", "ignore"]
            case "!": return ["delete"]
            case "~": return []
            case "L": return []
            case "E": return []
            case "T": return []
            default: return []
        }
    }


    static async update(dir: string) {
        return this.command(dir, "update")
    }


    // version
    static async version() {
        return this.command(this.root, "--version")
    }

    // version get 
    static async versionGet() {
        return this.command(this.root, "--version", "--quiet")
    }

    // compiled get 
    static async compiledGet() {
        let fullOutput = (await this.version()).stdout
        let lines = fullOutput.split("\n")
        let versionLine = lines[0]
        let version = versionLine.split(" ")[2]
        let compiledLine = lines[1]
        let compiled = compiledLine?.trim() || ""
        return { version, compiled }
    }

    // commit with selected file 
    static async commit(dir: string, message: string, files: string[]) {
        return this.command(dir, "commit", "-m", message, ...files)
    }

    // commit all 
    static async commitAll(dir: string, message: string) {
        return this.command(dir, "commit", "-m", message)
    }

    // cleanup
    static async cleanup(dir: string) {
        return this.command(dir, "cleanup")
    }

    // delete file 
    static async delete(dir: string, file: string) {
        return this.command(dir, "delete", file)
    }

    // list server  
    static async listServer(url: string) {
        return this.command(this.root, "list", url)
    }

    // url split protol and schema
    static removeProtolAndSchema(url: string) {
        return url.replace(/^(svn|svn\+ssh|http|https):\/\//, "")
    }

    static getProtolAndSchema(url: string) {
        let match = url.match(/^(svn|svn\+ssh|http|https):\/\//)
        if (match) return match[1]
    }

    // split svn host and path without protol
    static splitSvnHostAndPath(url: string) {
        let protol = this.getProtolAndSchema(url)
        url = this.removeProtolAndSchema(url)
        let [host, ...path] = url.split("/")
        return [protol, host, path.join("/")]
    }

    // get parent path 
    static getParentPath(url: string) {
        let [, , path] = this.splitSvnHostAndPath(url)
        let split = path?.split("/")
        let last = split?.pop()
        if (last == "") {
            split?.pop()
        }
        return split?.join("/")
    }


    // list server to folder or file tree 
    static async listServerToTree(url: string, isRoot: boolean = false) {
        let [protol, host, path] = this.splitSvnHostAndPath(url)

        let output = await this.listServer(url)
        let lines = output.stdout.split("\n")
        let files: object[] = []
        for (let line of lines) {
            let isFolder = line.endsWith("/");
            if (!!line) files.push({
                isFolder,
                name: line,
                host,
                protol,
                parent: path,
                path: path + (/\/$/.test(path || "") ? '' : '/') + line
            })
        }

        if (!isRoot) files.unshift({
            isFolder: true,
            name: "..",
            host,
            protol,
            path: this.getParentPath(url)
        })
        return files
    }

    // server info 
    static async infoServer(url: string) {
        let output = await this.command(this.root, "info", url)
        console.log(output.stdout)
        return new CommandlineResult<SvnServeInfo>(output)
    }
}