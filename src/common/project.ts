import { SvnInfo, SvnUtils } from "./SvnUtils"

export interface Project  {
    name:string,
    path:string,
    info:SvnInfo,
    isClean:boolean,
    uuid:string,
    lastUpdate?:Date,
}

export class ProjectImpl implements Project{
    name="";
    path="";
    info:SvnInfo;
    isClean=false;
    uuid="";
    lastUpdate?: Date;
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
    }

    async changeFiles(){
        return await SvnUtils.changeFileList(this.path);
    }
    
}