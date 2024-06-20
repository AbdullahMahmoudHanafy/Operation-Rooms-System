import express from 'express';
import path from 'path';
import multer from 'multer';
import { dirname } from "path";
import { fileURLToPath } from "url";
import  pool  from "./database.js"
import session from 'express-session';

const port = 3000;

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "Public")));

app.use(session({
    secret: 'secret_key', // Change this to a strong secret
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 30 * 1000, // Session duration (in milliseconds)
    },
}));

app.get("/", (req, res) => {
    res.render("./loginPage.ejs",{loginError: ""});
})

app.post("/loginAdmin", async (req, login) => {
    let email = req.body["email"], password = req.body["password"]
    
    await pool.connect()
    
    await pool.query("select * from admin where email = $1", [email], async (err, res) => {
        if(err){
            console.log(err)
        }else {
            if(res.rowCount == 0)
                login.render("./loginPage.ejs", {loginError: "البريد الالكتروني خاطئ"})
            else if(res.rows[0]["password"] != password)
                login.render("./loginPage.ejs", {loginError: "كلمة المرور خاطئة"})
            else {

                let dataNumbers = await getNumbers()
                let userId = res.rows[0]["nationalid"],
                    username = res.rows[0]["name"],
                    profileImage = res.rows[0]["image"]
    
                    req.session.user = {
                        userId, username, profileImage
                    }

                    login.render("./homePage.ejs",
                        {
                            name: req.session.user["username"],
                            dataNumbers: dataNumbers,
                            show:  null, error: "",
                            show1:  null, addSurgeonError: "",
                            show2:  null, addPatientError: "",
                            show3:  null, addAdminError: "",
                            show4:  null, addOperationError: "",
                            show5:  null, addDeviceError: "",
                            show6:  null, addAppointmentError: ""
                        }
                    )
            }
        }
    })
})

app.get("/homePage", async (req, res) => {
    let dataNumbers = await getNumbers()
    res.render("./homePage.ejs",
        {
            name: req.session.user["username"],
            dataNumbers: dataNumbers,
            show:  null, error: "",
            show1:  null, addSurgeonError: "",
            show2:  null, addPatientError: "",
            show3:  null, addAdminError: "",
            show4:  null, addOperationError: "",
            show5:  null, addDeviceError: "",
            show6:  null, addAppointmentError: ""
        })
})

app.get("/devices", async (req, data) => {

    await pool.query("select * from device", (err, res) => {
        if(err)
            console.log(err);
        else {
            data.render("./devices.ejs", {allDevices: res.rows, name: req.session.user["username"]});
        }
    })
})

app.get("/admins", async (req, data) => {

    await pool.query("select * from admin", (err, res) => {
        if(err)
            console.log(err);
        else {
            data.render("./admins.ejs", {allAdmins: res.rows, show: null, errorMessage : null});
        }
    })
})

app.get("/appointments", async (req, data) => {

    await pool.query("select P.name as patientname, D.name as surgeonname, O.name as operationname, O.duration as operationduration, A.* from appointment A join surgeon D on A.surgeonid = D.nationalid join patient P on A.patientid = P.nationalid join operation O on A.operationid = O.code", async (err, appointments) => {
        if(err)
            console.log(err);
        else {
            data.render("./appointments.ejs",{allAppointments: appointments.rows});
        }
    })
})

app.get("/doctors", async (req, data) => {

    await pool.query("select * from surgeon", (err, res) => {
        if(err)
            console.log(err);
        else {
            data.render("./doctors.ejs", {allDoctors: res.rows});
        }
    })
})

app.get("/operations", async (req, data) => {

    await pool.query("select * from operation", (err, res) => {
        if(err)
            console.log(err);
        else {
            data.render("./operations.ejs", {allOperations: res.rows});
        }
    })
})

app.get("/patients", async (req, data) => {

    await pool.query("select * from patient", (err, res) => {
        if(err)
            console.log(err);
        else {
            data.render("./patients.ejs", {allPatients: res.rows});
        }
    })
})





app.post("/addAdmin", async (req, respond) => {
    let name = req.body["name"],
    sex = req.body["sex"], 
    bdate = req.body["birthDate"], 
    email = req.body["email"], 
    password = req.body["password"],
    repassword = req.body["repassword"],
    phone = req.body["phone"],
    address = req.body["address"],
    nationalID = req.body["nationalID"],
    image = "123"

    if(repassword == password)
    {

        await pool.query(`select * from admin where nationalid = '${nationalID}'`, async (err, res) => {
            if(err)
                console.log(err)
            else {
                if(res.rowCount > 0)
                    {
                        let dataNumbers = await getNumbers()
                        respond.render("./homePage.ejs",
                            {
                                name: req.session.user["username"],
                                dataNumbers: dataNumbers,
                                show:  null, error: "",
                                show1:  null, addSurgeonError: "",
                                show2:  null, addPatientError: "",
                                show3:  "show", addAdminError: "هذا الرقم القومي موجود بالفعل",
                                show4:  null, addOperationError: "",
                                show5:  null, addDeviceError: "",
                                show6:  null, addAppointmentError: ""
                            })
                    }
                    else{
                        await pool.query(`select * from admin where email = '${email}'`, async (err, res) => {
                            if(err)
                                console.log(err)
                            else {
                                if(res.rowCount > 0)
                                    {
                                        let dataNumbers = await getNumbers()
                                        respond.render("./homePage.ejs",
                                            {
                                                name: req.session.user["username"],
                                                dataNumbers: dataNumbers,
                                                show:  null, error: "",
                                                show1:  null, addSurgeonError: "",
                                                show2:  null, addPatientError: "",
                                                show3:  "show", addAdminError: "هذا البريد الالكتروني موجود بالفعل",
                                                show4:  null, addOperationError: "",
                                                show5:  null, addDeviceError: "",
                                                show6:  null, addAppointmentError: ""
                                            })
                                    }else{
                                        await pool.query("insert into admin (name, email, nationalID, phone, address, password, sex, image, birthdate) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                                            [name, email, nationalID, phone, address, password, sex, image, bdate], async (err, res) => {
                                                if(err)
                                                    console.log(err)
                                                else {
                                                    let dataNumbers = await getNumbers()
                                                    respond.render("./homePage.ejs",
                                                        {
                                                            name: req.session.user["username"],
                                                            dataNumbers: dataNumbers,
                                                            show:  null, error: "",
                                                            show1:  null, addSurgeonError: "",
                                                            show2:  null, addPatientError: "",
                                                            show3:  null, addAdminError: "",
                                                            show4:  null, addOperationError: "",
                                                            show5:  null, addDeviceError: "",
                                                            show6:  null, addAppointmentError: ""
                                                        })
                                                }
                                            }
                                        )
                                    }
                            }
                        })
                    }
            }
        })
    }
    else {
        let dataNumbers = await getNumbers()
        respond.render("./homePage.ejs",
            {
                name: req.session.user["username"],
                dataNumbers: dataNumbers,
                show:  null, error: "",
                show1:  null, addSurgeonError: "",
                show2:  null, addPatientError: "",
                show3:  "show", addAdminError: "كلمة المرور غير متطابقة",
                show4:  null, addOperationError: "",
                show5:  null, addDeviceError: "",
                show6:  null, addAppointmentError: ""
            })
    }
})

app.post("/addPatient", async(req,respond) => {
    let name = req.body["name"], 
    ID = req.body["ID"], 
    birthdate = req.body["birthDate"], 
    sex = req.body["sex"], 
    address = req.body["address"], 
    phone = req.body["phone"], 
    image = "123"

    await pool.query(`select * from patient where nationalid = '${ID}'`, async (err, res) => {
        if(res.rowCount != 0)
            {
                let dataNumbers = await getNumbers()
                respond.render("./homePage.ejs",
                    {
                        name: req.session.user["username"],
                        dataNumbers: dataNumbers,
                        show:  null, error: "",
                        show1:  null, addSurgeonError: "",
                        show2:  "show", addPatientError: "هذا الرقم القومي موجود بالفعل",
                        show3:  null, addAdminError: "",
                        show4:  null, addOperationError: "",
                        show5:  null, addDeviceError: "",
                        show6:  null, addAppointmentError: ""
                    })
            }
        else{
            pool.query("insert into patient (name,  nationalid, birthdate, sex, address, phone, image) values ($1, $2, $3, $4, $5, $6, $7)",[name, ID, birthdate, sex, address, phone, image], async (err, res) => {
                if(err)
                    console.log(err)
                else {
                    let dataNumbers = await getNumbers()
                    respond.render("./homePage.ejs",
                        {
                            name: req.session.user["username"],
                            dataNumbers: dataNumbers,
                            show:  null, error: "",
                            show1:  null, addSurgeonError: "",
                            show2:  null, addPatientError: "",
                            show3:  null, addAdminError: "",
                            show4:  null, addOperationError: "",
                            show5:  null, addDeviceError: "",
                            show6:  null, addAppointmentError: ""
                        })
                }
            })
        }
    } )
})

app.post("/addSurgeon", async(req,respond) => {
    let name = req.body["name"], 
    ID = req.body["ID"], 
    birthdate = req.body["birthdate"], 
    sex = req.body["sex"], 
    address = req.body["address"], 
    phone = req.body["phone"], 
    email = req.body["email"],
    speciality = req.body["speciality"],
    image = "123"

    await pool.connect();

    await pool.query(`select * from surgeon where nationalid = '${ID}' OR email = '${email}'`,async (err, res) => {
        if(res.rows.length == 0)
            {
                pool.query("insert into surgeon (name, nationalid, birthdate, sex, address, phone, email, speciality, image) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                    [name, ID, birthdate, sex, address, phone, email, speciality, image], (err, res) => {
                        if(err)
                        console.log(err)
                    })
                    let dataNumbers = await getNumbers()
                    respond.render("./homePage.ejs", {
                        name: req.session.user["username"],
                        dataNumbers: dataNumbers,
                        show:  null, error: "",
                        show1:  null, addSurgeonError: "",
                        show2:  null, addPatientError: "",
                        show3:  null, addAdminError: "",
                        show4:  null, addOperationError: "",
                        show5:  null, addDeviceError: "",
                        show6:  null, addAppointmentError: ""
                    })
            }
        else{
            //the surgeon already exixts 
            let dataNumbers = await getNumbers()
            respond.render("./homePage.ejs", {
                name: req.session.user["username"],
                dataNumbers: dataNumbers,
                show:  null, error: "",
                show1:  "show", addSurgeonError: "هذا الطبيب مسجل بالفعل",
                show2:  null, addPatientError: "",
                show3:  null, addAdminError: "",
                show4:  null, addOperationError: "",
                show5:  null, addDeviceError: "",
                show6:  null, addAppointmentError: ""
            })
        }
    } )
})

app.post("/addDevice", async (req, respond) => {
    let name = req.body["name"],
    serial = req.body["serial"], 
    price = req.body["price"], 
    warranty = req.body["warranty"], 
    status = req.body["status"],
    company = req.body["company"],
    date = req.body["date"]

    await pool.connect();

    await pool.query(`select * from device where serialnumber = '${serial}'`, async (err, res) => {
        if(res.rows.length == 0)
            {    
            await pool.query("insert into device (name, serialnumber, price, warranty, status, company, date) values ($1, $2, $3, $4, $5, $6, $7)",
                [name, serial, price, warranty, status, company, date], async (err, res) => {
                    if(err)
                        console.log(err)
                    }
                )
                let dataNumbers = await getNumbers()
                    respond.render("./homePage.ejs", {
                        name: req.session.user["username"],
                        dataNumbers: dataNumbers,
                        show:  null, error: "",
                        show1:  null, addSurgeonError: "",
                        show2:  null, addPatientError: "",
                        show3:  null, addAdminError: "",
                        show4:  null, addOperationError: "",
                        show5:  null, addDeviceError: "",
                        show6:  null, addAppointmentError: ""
                    })
            }
        else{
            //the device already exists
            let dataNumbers = await getNumbers()
            respond.render("./homePage.ejs", {
                name: req.session.user["username"],
                dataNumbers: dataNumbers,
                show:  null, error: "",
                show1:  null, addSurgeonError: "",
                show2:  null, addPatientError: "",
                show3:  null, addAdminError: "",
                show4:  null, addOperationError: "",
                show5:  "show", addDeviceError: "هذا الجهاز مسجل بالفعل",
                show6:  null, addAppointmentError: ""
            })
        }
    })
})





async function getNumbers (req, res){
    let dataNumbers = ["", "", "", "", "", ""]


    await pool.query("select count(nationalid) from admin").then(res => {
        dataNumbers[0] = res.rows[0]["count"]
    })

    await pool.query("select count(nationalid) from surgeon").then(res => {
        dataNumbers[1] = res.rows[0]["count"]
    })

    await pool.query("select count(nationalid) from patient").then(res => {
        dataNumbers[2] = res.rows[0]["count"]
    })

    await pool.query("select count(serialnumber) from device").then(res => {
        dataNumbers[3] = res.rows[0]["count"]
    })

    await pool.query("select count(code) from operation").then(res => {
        dataNumbers[4] = res.rows[0]["count"]
    })

    await pool.query("select count(appointmentid) from appointment").then(res => {
        dataNumbers[5] = res.rows[0]["count"]
    })

    return dataNumbers
}


app.post("/adminsPageDeleteAdmin",async(req,res)=>{
    let id = req.body.deletetionID
    await pool.query("delete from admin where nationalid = $1",[id], async(err, rp) => {
        await pool.query("select * from admin", (err, respond) => {
            res.render("./admins.ejs", {allAdmins: respond.rows});
        })
    })
})

app.post("/doctorsPageDelete",async(req,res)=>{
    let id = req.body.deletetionID
    await pool.query("delete from surgeon where nationalid = $1",[id], async(err, rp) => {
        await pool.query("select * from surgeon", (err, respond) => {
            res.render("./doctors.ejs", {allDoctors: respond.rows});
        })
    })
})

app.post("/patientsPageDelete",async(req,res)=>{
    let id = req.body.deletetionID
    await pool.query("delete from patient where nationalid = $1",[id], async(err, rp) => {
        await pool.query("select * from patient", (err, respond) => {
            res.render("./patients.ejs", {allPatients: respond.rows});
        })
    })
})

app.post("/operationsPageDelete",async(req,res)=>{
    let code = req.body.deletetionCode
    await pool.query("delete from operation where code = $1",[code], async(err, rp) => {
        await pool.query("select * from operation", (err, respond) => {
            res.render("./operations.ejs", {allOperations: respond.rows});
        })
    })
})

app.post("/devicesPageDelete",async(req,res)=>{
    let Serial = req.body.deletetionSerial
    await pool.query("delete from device where serialnumber = $1",[Serial], async(err, rp) => {
        await pool.query("select * from device", (err, respond) => {
            res.render("./devices.ejs", {allDevices: respond.rows});
        })
    })
})

app.post("/appointmentsPageDelete",async(req,res)=>{
    let id = req.body.deletetionID
    await pool.query("delete from appointment where appointmentid = $1",[id], async(err, rp) => {
        await pool.query("select P.name as patientname, D.name as surgeonname, O.name as operationname, O.duration as operationduration, A.* from appointment A join surgeon D on A.surgeonid = D.nationalid join patient P on A.patientid = P.nationalid join operation O on A.operationid = O.code", async (err, appointments) => {
            if(err)
                console.log(err);
            else {
                res.render("./appointments.ejs",{allAppointments: appointments.rows});
            }
        })
    })
})


app.listen(port, (req, res) => {
    console.log(`server is running on port number ${port}`);
})