type PrismaDelegate = {
  findFirstOrThrow: (args: any) => Promise<any>;
  findMany: (args?: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  updateMany: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
  deleteMany: (args: any) => Promise<any>;
};

export default abstract class Dao<MODEL_TYPE extends PrismaDelegate>{
    protected model: MODEL_TYPE;
    
    public constructor(model: any){ this.model = model; }

    // Returns any model
    public async getById(id: number | null): Promise<any>{
        try{
            if (id === null)
                throw Error("Id not provided");

            return await this.model.findFirstOrThrow({where: {Id: id}})
        }catch(err: any){
            return null;
        }
    }

    public async getByName(name: string | null): Promise<any>{
        try{
            if (name === null)
                throw Error("Name not provided");

            return await this.model.findFirstOrThrow({where: {Name: name}})
        }catch(err: any){
            return null;
        }
    }

    public async getAll(): Promise<any>{
        try{
            return await this.model.findMany();
        }catch(err: any){
            return [];
        }
    }


    public async getSome(where: any, select: any | null = null): Promise<any>{
        try{
            return await this.model.findMany({where: where, select: select});
        }catch(err: any){
            return [];
        }
    }

    public async getOne(where: any): Promise<any>{
        try{
            return await this.model.findFirstOrThrow({where: where});
        }catch(err: any){
            return null;
        }
    }

    public async update(data: any, where: any): Promise<any>{
        try{
            return await this.model.update({data: data, where: where});
        }catch(err: any){
            throw err;
        }
    }

    public async updateMany(data: any, where: any): Promise<any>{
        try{
            return await this.model.updateMany({data: data, where: where});
        }catch(err: any){
            throw err;
        }
    }

    public async add(data: any): Promise<any>{
        try{
            return await this.model.create({data: data});
        }catch(err: any){
            throw err;
        }
    }

    public async delete(id: number | null): Promise<any>{
        try{
            if (id === null)
                throw Error("Id not provided");

            await this.model.delete({ where: { Id: id }});
        }catch(err: any){
            console.log("FAILED TO DELETE WITH ID: " + id);
            throw err;
        }
    }

    public async deleteMany(where: any): Promise<any>{
        try{
            await this.model.deleteMany({ where: where});
        }catch(err: any){
            throw err;
        }
    }
} 