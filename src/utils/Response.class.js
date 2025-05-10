class Response {
    constructor(data=null,message,success) {
        this.message = message;
        this.data = data;
        this.success_type  = success;
    }
    success = (res) => {
        return res.status(200).json({
            message:this.message,
            success:this.success_type,
            data:this.data
        })
    }
    error404 = (res) => {
        return res.status(404).json({
            message:this.message,
            success:this.success_type,
            data:this.data
        })
    }
    error403 = (res) => {
        return res.status(403).json({
            message:this.message,
            success:this.success_type,
            data:this.data
        })
    }
    error429 = (res) => {
        return res.status(429).json({
            message:this.message,
            success:this.success_type,
            data:this.data
        })
    }
    error500 = (res) => {
        return res.status(500).json({
            message:this.message,
            success:this.success_type,
            data:this.data
        })
    }
};
module.exports = Response
