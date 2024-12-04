export async function checkName(req, res, next){
    console.log('I do not know you');
    next();
}
export async function logHTTP(req, res, next){
    if(counter.has(req.method)){
        counter.set(req.method, counter.get(req.method)+1);
    }
    else{
        counter.set(req.method, 1);
    }
    console.log(Date().toString());
    console.log(counter);
    next();
}