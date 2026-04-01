exports.id=362,exports.ids=[362],exports.modules={1090:(a,b,c)=>{"use strict";c.d(b,{U:()=>h,o:()=>i});var d=c(9640);let e=null;function f(){return e||(e=new d.u(process.env.RESEND_API_KEY)),e}function g(a){return new Date(a).toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}async function h(a,b,c){try{await f().emails.send({from:process.env.RESEND_FROM_EMAIL??"booking@clinic.example.com",to:a.patientEmail,subject:`Booking confirmed — ${b.name} on ${g(a.date)} at ${a.time}`,html:`
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F0F4FF;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(37,99,235,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#2563EB;padding:32px 40px;">
            <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Oslo Clinic</p>
            <h1 style="margin:8px 0 0;color:#FFFFFF;font-size:26px;font-weight:700;letter-spacing:-0.01em;">Booking Confirmed</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
              Hello <strong>${a.patientName}</strong>,<br>
              Your appointment has been booked. Here are your details:
            </p>

            <!-- Details card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;border-radius:10px;overflow:hidden;margin-bottom:32px;">
              <tr>
                <td style="padding:24px 28px;">
                  <table width="100%" cellpadding="0" cellspacing="8">
                    <tr>
                      <td style="color:#6B7280;font-size:13px;padding-bottom:12px;width:40%;">Doctor</td>
                      <td style="color:#111827;font-size:14px;font-weight:600;padding-bottom:12px;">${b.name}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B7280;font-size:13px;padding-bottom:12px;">Specialty</td>
                      <td style="color:#111827;font-size:14px;padding-bottom:12px;">${b.specialty}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B7280;font-size:13px;border-top:1px solid #E5E7EB;padding-top:12px;padding-bottom:12px;">Date</td>
                      <td style="color:#111827;font-size:14px;font-weight:600;border-top:1px solid #E5E7EB;padding-top:12px;padding-bottom:12px;">${g(a.date)}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B7280;font-size:13px;padding-bottom:12px;">Time</td>
                      <td style="color:#2563EB;font-size:14px;font-weight:700;padding-bottom:12px;">${a.time}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B7280;font-size:13px;border-top:1px solid #E5E7EB;padding-top:12px;padding-bottom:12px;">Clinic</td>
                      <td style="color:#111827;font-size:14px;padding-top:12px;padding-bottom:12px;">${c.name}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B7280;font-size:13px;padding-bottom:4px;">Address</td>
                      <td style="color:#111827;font-size:14px;padding-bottom:4px;">${c.address}, Oslo</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.7;">
              <strong>Reason for visit:</strong> ${a.reason}
            </p>

            <p style="margin:24px 0 0;color:#6B7280;font-size:13px;line-height:1.7;border-top:1px solid #E5E7EB;padding-top:24px;">
              If you need to reschedule or cancel, please contact us at least 24 hours in advance.
              Reply to this email or call the clinic directly.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;padding:24px 40px;border-top:1px solid #E5E7EB;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;line-height:1.6;">
              Oslo Clinic Network \xb7 Karl Johans gate 25, Oslo<br>
              This is an automated confirmation. Please do not reply to this message directly.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`})}catch(a){console.error("[email] Failed to send confirmation:",a)}}async function i(a,b,c){try{await f().emails.send({from:process.env.RESEND_FROM_EMAIL??"booking@clinic.example.com",to:a.patientEmail,subject:`Appointment cancelled — ${b.name} on ${g(a.date)}`,html:`
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F0F4FF;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(37,99,235,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#6B7280;padding:32px 40px;">
            <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Oslo Clinic</p>
            <h1 style="margin:8px 0 0;color:#FFFFFF;font-size:26px;font-weight:700;letter-spacing:-0.01em;">Appointment Cancelled</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
              Hello <strong>${a.patientName}</strong>,<br>
              Your appointment has been cancelled. Details of the cancelled booking:
            </p>

            <table width="100%" cellpadding="0" cellspacing="8" style="background:#FEF2F2;border-radius:10px;padding:24px 28px;margin-bottom:32px;">
              <tr>
                <td style="color:#6B7280;font-size:13px;padding-bottom:10px;width:40%;">Doctor</td>
                <td style="color:#111827;font-size:14px;font-weight:600;padding-bottom:10px;">${b.name}</td>
              </tr>
              <tr>
                <td style="color:#6B7280;font-size:13px;padding-bottom:10px;">Date &amp; Time</td>
                <td style="color:#111827;font-size:14px;font-weight:600;padding-bottom:10px;">${g(a.date)} at ${a.time}</td>
              </tr>
              <tr>
                <td style="color:#6B7280;font-size:13px;">Clinic</td>
                <td style="color:#111827;font-size:14px;">${c.name}</td>
              </tr>
            </table>

            <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">
              To book a new appointment, visit our website or call the clinic directly.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;padding:24px 40px;border-top:1px solid #E5E7EB;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;line-height:1.6;">
              Oslo Clinic Network \xb7 Karl Johans gate 25, Oslo
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`})}catch(a){console.error("[email] Failed to send cancellation:",a)}}},4652:(a,b,c)=>{"use strict";c.d(b,{ED:()=>h,aK:()=>g,gP:()=>f});let d=[{id:"sentrum",name:"Sentrum Klinikk",address:"Karl Johans gate 25",district:"Sentrum"},{id:"majorstuen",name:"Majorstuen Medisinsenter",address:"Bogstadveien 12",district:"Majorstuen"},{id:"grunerl\xf8kka",name:"Gr\xfcnerl\xf8kka Legesenter",address:"Thorvald Meyers gate 55",district:"Gr\xfcnerl\xf8kka"}],e=[{id:"eriksen",name:"Dr. Lars Eriksen",specialty:"General Practitioner",bio:"Fifteen years of family medicine with a focus on preventive care.",locationIds:["sentrum","majorstuen"]},{id:"hansen",name:"Dr. Ingrid Hansen",specialty:"Cardiologist",bio:"Specialist in heart disease and cardiovascular prevention programs.",locationIds:["sentrum"]},{id:"berg",name:"Dr. Morten Berg",specialty:"Dermatologist",bio:"Skin health specialist treating both medical and cosmetic conditions.",locationIds:["majorstuen","grunerl\xf8kka"]},{id:"lindqvist",name:"Dr. Astrid Lindqvist",specialty:"Psychologist",bio:"Cognitive behavioural therapy and mental health support for adults.",locationIds:["grunerl\xf8kka"]},{id:"dahl",name:"Dr. Kristoffer Dahl",specialty:"Orthopaedic Surgeon",bio:"Musculoskeletal injuries and sports medicine — back, knees, shoulders.",locationIds:["sentrum","grunerl\xf8kka"]},{id:"nygaard",name:"Dr. Silje Nygaard",specialty:"Paediatrician",bio:"Children's health from newborns through adolescence.",locationIds:["majorstuen"]}];function f(a){return e.find(b=>b.id===a)}function g(a){return d.find(b=>b.id===a)}function h(){let a=[];for(let b=8;b<=15;b++)a.push(`${String(b).padStart(2,"0")}:00`),b<16&&a.push(`${String(b).padStart(2,"0")}:30`);return a}},6487:()=>{},7462:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{O:()=>s,VA:()=>q,al:()=>m,m7:()=>n,nz:()=>p,sH:()=>o,vZ:()=>r});var e=c(8562),f=a([e]);e=(f.then?(await f)():f)[0];let t=null,u=!1;function g(){if(t)return t;let a=process.env.TURSO_DATABASE_URL,b=process.env.TURSO_AUTH_TOKEN;if(!a)throw Error("TURSO_DATABASE_URL is not set");if(!b)throw Error("TURSO_AUTH_TOKEN is not set");return t=(0,e.createClient)({url:a,authToken:b})}async function h(){if(u)return;u=!0;let a=g();await a.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      patientName  TEXT NOT NULL,
      patientPhone TEXT NOT NULL,
      patientEmail TEXT NOT NULL,
      reason       TEXT NOT NULL,
      doctorId     TEXT NOT NULL,
      locationId   TEXT NOT NULL,
      date         TEXT NOT NULL,
      time         TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'pending',
      createdAt    TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);let{rows:b}=await a.execute("SELECT COUNT(*) as n FROM bookings");0===Number(b[0]?.n??0)&&await k(a)}function i(a,b){let c=new Date(a),d=0;for(;d<b;){c.setDate(c.getDate()+1);let a=c.getDay();0!==a&&6!==a&&d++}return c.toISOString().split("T")[0]}function j(a,b){let c=new Date(a),d=0;for(;d<b;){c.setDate(c.getDate()-1);let a=c.getDay();0!==a&&6!==a&&d++}return c.toISOString().split("T")[0]}async function k(a){let b="2026-04-01";for(let c of[{patientName:"Emma Larsen",patientPhone:"+47 90 12 34 56",patientEmail:"emma.larsen@email.no",reason:"Annual check-up",doctorId:"eriksen",locationId:"sentrum",date:j(b,3),time:"09:00",status:"confirmed"},{patientName:"Ole Bakken",patientPhone:"+47 91 23 45 67",patientEmail:"ole.bakken@email.no",reason:"Chest pains and breathlessness",doctorId:"hansen",locationId:"sentrum",date:j(b,2),time:"10:30",status:"confirmed"},{patientName:"Nora Vik",patientPhone:"+47 92 34 56 78",patientEmail:"nora.vik@email.no",reason:"Skin rash — recurring",doctorId:"berg",locationId:"grunerl\xf8kka",date:j(b,2),time:"14:00",status:"confirmed"},{patientName:"Jonas Halvorsen",patientPhone:"+47 93 45 67 89",patientEmail:"jonas.h@email.no",reason:"Knee pain after running",doctorId:"dahl",locationId:"sentrum",date:j(b,1),time:"08:00",status:"confirmed"},{patientName:"Mia Thorsen",patientPhone:"+47 94 56 78 90",patientEmail:"mia.t@email.no",reason:"Anxiety — first appointment",doctorId:"lindqvist",locationId:"grunerl\xf8kka",date:j(b,1),time:"11:00",status:"confirmed"},{patientName:"Sofie Andersen",patientPhone:"+47 95 67 89 01",patientEmail:"sofie.a@email.no",reason:"Child vaccination — 12 months",doctorId:"nygaard",locationId:"majorstuen",date:b,time:"09:00",status:"confirmed"},{patientName:"Petter Strand",patientPhone:"+47 96 78 90 12",patientEmail:"petter.s@email.no",reason:"Blood pressure follow-up",doctorId:"eriksen",locationId:"majorstuen",date:b,time:"10:00",status:"confirmed"},{patientName:"Ida Knutsen",patientPhone:"+47 97 89 01 23",patientEmail:"ida.k@email.no",reason:"Eczema — new flare-up",doctorId:"berg",locationId:"majorstuen",date:b,time:"13:30",status:"pending"},{patientName:"Henrik Olsen",patientPhone:"+47 98 90 12 34",patientEmail:"henrik.o@email.no",reason:"Lower back pain",doctorId:"dahl",locationId:"grunerl\xf8kka",date:b,time:"14:30",status:"pending"},{patientName:"Lise N\xe6ss",patientPhone:"+47 99 01 23 45",patientEmail:"lise.n@email.no",reason:"General consultation",doctorId:"eriksen",locationId:"sentrum",date:i(b,1),time:"09:30",status:"pending"},{patientName:"Tor Magnusson",patientPhone:"+47 40 12 34 56",patientEmail:"tor.m@email.no",reason:"ECG and stress test review",doctorId:"hansen",locationId:"sentrum",date:i(b,1),time:"11:00",status:"confirmed"},{patientName:"Camilla Brandt",patientPhone:"+47 41 23 45 67",patientEmail:"camilla.b@email.no",reason:"CBT session — ongoing",doctorId:"lindqvist",locationId:"grunerl\xf8kka",date:i(b,2),time:"10:00",status:"confirmed"},{patientName:"Rune Fredriksen",patientPhone:"+47 42 34 56 78",patientEmail:"rune.f@email.no",reason:"Shoulder physio referral",doctorId:"dahl",locationId:"sentrum",date:i(b,2),time:"14:00",status:"pending"},{patientName:"Astrid Lie",patientPhone:"+47 43 45 67 89",patientEmail:"astrid.l@email.no",reason:"Child fever and ear infection",doctorId:"nygaard",locationId:"majorstuen",date:i(b,3),time:"08:30",status:"pending"},{patientName:"Bj\xf8rn Haugen",patientPhone:"+47 44 56 78 90",patientEmail:"bjorn.h@email.no",reason:"Mole check — three sites",doctorId:"berg",locationId:"grunerl\xf8kka",date:i(b,4),time:"13:00",status:"pending"}])await a.execute({sql:"INSERT INTO bookings (patientName, patientPhone, patientEmail, reason, doctorId, locationId, date, time, status) VALUES (?,?,?,?,?,?,?,?,?)",args:[c.patientName,c.patientPhone,c.patientEmail,c.reason,c.doctorId,c.locationId,c.date,c.time,c.status]})}function l(a){return{id:Number(a.id),patientName:String(a.patientName),patientPhone:String(a.patientPhone),patientEmail:String(a.patientEmail),reason:String(a.reason),doctorId:String(a.doctorId),locationId:String(a.locationId),date:String(a.date),time:String(a.time),status:a.status,createdAt:String(a.createdAt)}}async function m(){await h();let{rows:a}=await g().execute("SELECT * FROM bookings ORDER BY date DESC, time ASC");return a.map(a=>l(a))}async function n(a){await h();let{rows:b}=await g().execute({sql:"SELECT * FROM bookings WHERE id = ?",args:[a]});if(0!==b.length)return l(b[0])}async function o(a){await h();let b=g(),c=await b.execute({sql:"INSERT INTO bookings (patientName, patientPhone, patientEmail, reason, doctorId, locationId, date, time, status) VALUES (?,?,?,?,?,?,?,?,?)",args:[a.patientName,a.patientPhone,a.patientEmail,a.reason,a.doctorId,a.locationId,a.date,a.time,"pending"]});return await n(Number(c.lastInsertRowid))}async function p(a,b){return await h(),await g().execute({sql:"UPDATE bookings SET status = ? WHERE id = ?",args:[b,a]}),n(a)}async function q(a){await h(),await g().execute({sql:"DELETE FROM bookings WHERE id = ?",args:[a]})}async function r(a,b){await h();let{rows:c}=await g().execute({sql:"SELECT time FROM bookings WHERE date = ? AND doctorId = ? AND status != 'cancelled'",args:[a,b]});return c.map(a=>String(a.time))}async function s(a,b,c){if(await h(),!b&&!c)return;let d=[],e=[];b&&(d.push("date = ?"),e.push(b)),c&&(d.push("time = ?"),e.push(c)),e.push(a),await g().execute({sql:`UPDATE bookings SET ${d.join(", ")} WHERE id = ?`,args:e})}d()}catch(a){d(a)}})},8335:()=>{}};