const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red);

  const error= {...err}


   if(error.name==='Cast Error'){
    error.message='Энэ ID буруу бүтэцтэй байна ',
    error.status=400
   }


   if(error.code===11000){
    error.message = 'Талбарын утгыг давхардуулж болохгүй ',
    error.status = 400
   }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.error,
  });
};

module.exports = errorHandler;
