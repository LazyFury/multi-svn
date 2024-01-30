
export const getExtFromFileName = (fileName: string) => {
    if(!/(\.)/.test(fileName)) return "__folder";
    const ext = fileName.split(".").pop()
    return ext;
}

export const fileIconFromFileName = (fileName: string) => {
    const ext = getExtFromFileName(fileName)||"";
    if(isFolder(fileName)){
        return "vscode-icons:default-folder-opened";
    }
    return "vscode-icons:"+fileIcon(ext);
}

export const isFolder = (fileName: string) => {
    let ext = getExtFromFileName(fileName);
    return ext == "__folder";
}

// iconify icon with vscode-icons
export const fileIcon = (ext: string) => {
    switch (ext) {
        case "vue":
            return "file-type-vue";
        case "js":
            return "file-type-js";
        case "ts":
            return "file-type-typescript";
        case "json":
            return "file-type-json";
        case "html":
            return "file-type-html";
        case "css":
            return "file-type-css";
        case "scss":
            return "file-type-sass";
        case "less":
            return "file-type-less";
        case "txt":
        case "md":
            return "file-type-markdown";
        case "py":
            return "file-type-python";
        case "java":
            return "file-type-java";
        case "php":
            return "file-type-php";
        case "go":
            return "file-type-go";
        case "c":
            return "file-type-c";
        case "cpp":
            return "file-type-cpp";
        case "tsx":
            return "file-type-reactts";
        case "jsx":
            return "file-type-react";
        case "rb":
            return "file-type-ruby";
        case "cs":
            return "file-type-csharp";
        case "swift":
            return "file-type-swift";
        case "kt":
            return "file-type-kotlin";
        case "dart":
            return "file-type-dart";
        default:
            return "file-type-file";
    }    
}