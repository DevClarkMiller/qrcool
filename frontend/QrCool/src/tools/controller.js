export default class Controller{
    constructor(appContext){
        this.appContext = appContext;

        // Bind methods
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.set = this.set.bind(this);
        this.delete = this.delete.bind(this);
    }

    async get(route, success, error = null, params = null){
        this.appContext.Request.get(route, success, error, params);
    }
 
    async getBlob(route, success, error = null, params = null){
        this.appContext.Request.getBlob(route, success, error, params);
    }

    async post(route, data, success, error = null){
        this.appContext.Request.post(route, data, success, error);
    }

    async postFile(route, file, success, error = null){
        this.appContext.Request.postFile(route, file, success, error);
    }

    async set(route, data, success, error = null){
        this.appContext.Request.put(route, data, success, error);
    }

    async delete(route, success, error = null){
        this.appContext.Request.delete(route, success, error);
    }
  }