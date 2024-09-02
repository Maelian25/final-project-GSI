from fastapi import FastAPI, HTTPException
from db_api import db_api, User, Produit, ArticleUser
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://localhost:3000", "https://tt-api.azurewebsites.net/"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


########## API ./users ##########


@app.post("/users/")
async def create_user(
    username: str, mail: str, hashed_password: str, user_type: str, localisation: str
):
    user = User(
        username=username,
        mail=mail,
        hashed_password=hashed_password,
        user_type=user_type,
        localisation=localisation,
    )
    db_api.create_user(user)
    return {"message": "User created successfully"}


@app.get("/users/{username}")
async def get_user(username: str):
    user = db_api.get_user(username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/users/")
async def get_users():
    users = db_api.get_users()
    return users


@app.put("/users/{username}")
async def update_user(
    username: str, mail: str, hashed_password: str, user_type: str, localisation: str
):
    user = User(
        username=username,
        mail=mail,
        hashed_password=hashed_password,
        user_type=user_type,
        localisation=localisation,
    )
    db_api.update_user(user)
    return {"message": "User updated successfully"}


@app.delete("/users/{username}")
async def delete_user(username: str):
    db_api.delete_user(username)
    return {"message": "User deleted successfully"}


########## API ./users/article ##########


@app.post("/users/{username}/article_user/")
async def add_article_user(username: str, id_product: int):
    articleUser = ArticleUser(username=username, id_product=id_product)
    db_api.create_article_user(articleUser)
    return {"message": "Article added to user successfully"}


@app.get("/users/{username}/article_user/")
async def get_articles_user(username: str):
    articles = db_api.get_articles_user(username)
    return articles


@app.get("/users/{username}/article_user/{article_id}")
async def get_article_user(username: str, article_id: int):
    article = db_api.get_article_user(username, article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@app.get("/users/article_user/{article_id}")
async def get_article_users(article_id: int):
    articles = db_api.get_article_users(article_id)
    return articles


@app.delete("/users/{username}/article_user/{article_id}")
async def delete_article_user(username: str, article_id: int):
    db_api.delete_article_user(username, article_id)
    return {"message": "Article deleted from user successfully"}


@app.delete("/users/{username}/article_user/")
async def delete_all_articles_user(username: str):
    db_api.delete_all_articles_user(username)
    return {"message": "All articles deleted from user successfully"}


@app.put("/users/{username}/article_user/{article_id}")
async def update_article_user(username: str, article_id: int):
    db_api.update_article_user(username, article_id)
    return {"message": "Article updated successfully"}


########## API ./produit ##########


@app.post("/produit/")
async def create_produit(
    name: str,
    fabricant: str,
    score_danger: int,
    cas_number: str,
    quantity_masse=None,
    quantity_vol=None,
    description=None,
    etat_physique=None,
    cid_number=None,
    phase_risque=None,
    classif_sgh=None,
    icpe=None,
    pH=None,
    temp_ebullition=None,
    pression_vapeur=None,
    code_tunnel=None,
    danger_codes=None,
    salle=None,
    date=None,
    storage_unit=None,
):
    produit = Produit(
        name=name,
        fabricant=fabricant,
        score_danger=score_danger,
        cas_number=cas_number,
        quantity_masse=quantity_masse,
        quantity_vol=quantity_vol,
        description=description,
        etat_physique=etat_physique,
        cid_number=cid_number,
        phase_risque=phase_risque,
        classif_sgh=classif_sgh,
        icpe=icpe,
        pH=pH,
        temp_ebullition=temp_ebullition,
        pression_vapeur=pression_vapeur,
        code_tunnel=code_tunnel,
        danger_codes=danger_codes,
        salle=salle,
        date=date,
        storage_unit=storage_unit,
    )
    db_api.create_produit(produit)
    return {"message": "Produit created successfully"}


@app.get("/produit/{produit_id}")
async def get_produit(produit_id: int):
    produit = db_api.get_produit(produit_id)
    if produit is None:
        raise HTTPException(status_code=404, detail="Produit not found")
    return produit


@app.get("/produit/")
async def get_produits():
    produits = db_api.get_produits()
    return produits


@app.put("/produit/{produit_id}")
async def update_produit(
    produit_id: int,
    nom: str,
    description: str,
    prix: float,
    quantite: int,
    localisation: str,
    username: str,
):
    db_api.update_produit(
        produit_id, nom, description, prix, quantite, localisation, username
    )
    return {"message": "Produit updated successfully"}


@app.delete("/produit/{produit_id}")
async def delete_produit(produit_id: int):
    db_api.delete_produit(produit_id)
    return {"message": "Produit deleted successfully"}


# Additional endpoints can be added here
