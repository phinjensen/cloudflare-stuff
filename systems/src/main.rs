use actix_web::{get, web, App, HttpMessage, HttpServer, HttpRequest, HttpResponse, Responder};
use actix_web::http::Cookie;
use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey};
use serde::{Serialize, Deserialize};
use std::time::SystemTime;

fn now_as_secs() -> usize {
    SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_secs() as usize
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
    iss: usize,
}

#[get("/auth/{username}")]
async fn auth(web::Path(username): web::Path<String>) -> impl Responder {
    let now = now_as_secs();
    let claims = Claims {
        sub: String::from(&username),
        exp: now + 24 * 60 * 60,
        iss: now
    };
    let header = Header::new(Algorithm::RS256);
    let key = EncodingKey::from_rsa_pem(
        include_bytes!("private.pem")
    ).unwrap();
    let token = encode(
        &header,
        &claims,
        &key
    ).unwrap();
    //let cookie = Cookie::new("token", token);
    HttpResponse::Ok()
        .content_type("text/html")
        .cookie(
            Cookie::build("token", token)
                .http_only(true)
                .path("/")
                .finish()
        )
        .body("<a href='/verify'>here</a>")
}

#[get("/verify")]
async fn verify(req: HttpRequest) -> impl Responder {
    if let Some(token) = req.cookie("token") {
        let key = DecodingKey::from_rsa_pem(
            include_bytes!("public.pem")
        ).unwrap();
        return match decode::<Claims>(&token.value(), &key, &Validation::new(Algorithm::RS256)) {
            Ok(t) => HttpResponse::Ok().body(format!("{}", t.claims.sub)),
            Err(e) => HttpResponse::Unauthorized()
                .body(format!("Error authenticating: {}", e))
        };
    }
    HttpResponse::Unauthorized()
        .body("Error authenticating: No JWT cookie")
}

#[get("/stats")]
async fn stats() -> impl Responder {
    format!("stats")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(auth).service(verify).service(stats))
        .bind("127.0.0.1:8080")?
        .run()
        .await
}
