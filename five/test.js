const bcrypt = require("bcrypt"); // npm install bcrypt

const plainPassword = "imran123";
bcrypt.hash(plainPassword, 1,  (error, hashed) => {
  if (error) {
    console.log(`Problem ${error}`);
  } else {
    console.log(`Hashirana lozinka:${hashed}`);
  }
});

bcrypt.compare('imran123', '$2b$04$HvEbZt.81MKhRQCcC5uU..hcyJQSfCAD419O83iuohMCpAfLB2Cx.', (error, result)=>{
    if(error){
        console.log(`${error}`);
    }else{
        if(result){
            console.log('Pasword match');
        }else{
            console.log("Password doesn't match");
        }
    }
});

