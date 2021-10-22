use actix_web::{get, web, App, HttpServer, Responder};

#[get("/auth/{username}")]
async fn auth(web::Path((username, )): web::Path<(String, )>) -> impl Responder {
    format!("Hello {}!", username)
}

#[get("/verify")]
async fn verify() -> impl Responder {
    format!("verify")
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
