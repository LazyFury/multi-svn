import { SvnInfo, SvnUtils } from "./SvnUtils"

export interface Project  {
    name:string,
    path:string,
    info:SvnInfo,
    isClean:boolean,
    uuid:string,
    lastUpdate?:Date,
    validate:boolean,
}

export class ProjectImpl implements Project{
    name="";
    path="";
    info:SvnInfo;
    isClean=false;
    uuid="";
    lastUpdate?: Date;
    validate=true;
    constructor(name:string,path:string,info:SvnInfo,isClean:boolean,uuid:string){
        this.name = name;
        this.path = path;
        this.info = info;
        this.isClean = isClean;
        this.uuid = uuid;
    }

    static async New(name:string,path:string){
        let info = (await SvnUtils.info(path)).format();
        return new ProjectImpl(name,path,info,false,info.Repository_UUID);
    }

    /**
     * use storage 实例化的时候缺少方法
     * @param project 
     */
    static fromProject(project:ProjectImpl){
        return new ProjectImpl(project.name,project.path,project.info,project.isClean,project.uuid);
    }

    /**
     *  update info
     */
    public async updateInfo(){
        let info = (await SvnUtils.info(this.path)).format();
        this.info = info;
        this.uuid = info.Repository_UUID;
        this.lastUpdate = new Date();
        let isClean = (await SvnUtils.isClean(this.path));
        this.isClean = isClean;
        // SvnUtils.update(this.path);
        return this;
    }

    async changeFiles(){
        return await SvnUtils.changeFileList(this.path);
    }
    

    async delete(file:string){
        let result = await SvnUtils.delete(this.path,file.trim());
        if(result.stdout!=""){
            let [status] = result.stdout.split(" ");
            if(status=="D"){
                return true;
            }
        }
        return false;
    }

    async commit(files:string[],message:string="commit"){
        let result = await SvnUtils.commit(this.path,message,files.map(f=>f.trim()));
        let line1 = result.stdout.split("\n")[0]
        let [status] = line1.split(" ");
        return status!="";
    }

    // add file 
    async add(file:string){
        let result = await SvnUtils.add(this.path,file.trim());
        let line1 = result.stdout.split("\n")[0]
        let [status] = line1.split(" ");
        return status!="";
    }

    // ignore file 
    async ignore(file:string){
        let result = await SvnUtils.ignore(this.path,file.trim());
        let line1 = result.stdout.split("\n")[0]
        let [status] = line1.split(" ");
        return status!="";
    }

    // update 
    async update(){
        let result = await SvnUtils.update(this.path);
        let line1 = result.stdout.split("\n")[0]
        let [status] = line1.split(" ");
        return status!="";
    }
}