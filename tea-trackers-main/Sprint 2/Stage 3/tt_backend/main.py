from fastapi import FastAPI, HTTPException, Body
from db_api import db_api, User, Produit, ArticleUser
from pydantic import BaseModel, validator
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import bcrypt

app = FastAPI()

origins = ["http://localhost:3000", "https://tt-api.azurewebsites.net/"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

## Pydantic models ##

class BaseUserModel(BaseModel):
    username: str
    mail: str
    hashed_password: str
    user_type: str
    localisation: str

    @validator('hashed_password', pre=True, always=True)
    def hash_password(cls, v):
        return hash_pass(v) if v is not None else None

class UpdateUserModel(BaseModel):
    mail: Optional[str] = None
    hashed_password: Optional[str] = None
    user_type: Optional[str] = None
    localisation: Optional[str] = None

    @validator('hashed_password', pre=True, always=True)
    def hash_password(cls, v):
        return hash_pass(v) if v is not None else None
    
class BaseProduitModel(BaseModel):
    name: str
    fabricant: str
    score_danger: int
    cas_number: str
    quantity_masse: Optional[float] = None
    quantity_vol: Optional[float] = None
    description: Optional[str] = None
    etat_physique: Optional[str] = None
    cid_number: Optional[int] = None
    phase_risque: Optional[str] = None
    classif_sgh: Optional[str] = None
    icpe: Optional[str] = None
    pH: Optional[float] = None
    temp_ebullition: Optional[float] = None
    pression_vapeur: Optional[float] = None
    code_tunnel: Optional[str] = None
    danger_codes: Optional[str] = None
    salle: Optional[str] = None
    date: Optional[str] = None  # Use datetime.date if you need a date object
    storage_unit: Optional[str] = None
    id_db : Optional[str] = None

    class Config: 
        orm_mode = True

class UpdateProduitModel(BaseModel):
    name: Optional[str] = None
    fabricant: Optional[str] = None
    score_danger: Optional[int] = None
    cas_number: Optional[str] = None
    quantity_masse: Optional[int] = None
    quantity_vol: Optional[int] = None
    description: Optional[str] = None
    etat_physique: Optional[str] = None
    cid_number: Optional[str] = None
    phase_risque: Optional[str] = None
    classif_sgh: Optional[str] = None
    icpe: Optional[str] = None
    pH: Optional[str] = None
    temp_ebullition: Optional[str] = None
    pression_vapeur: Optional[str] = None
    code_tunnel: Optional[str] = None
    danger_codes: Optional[str] = None
    salle: Optional[str] = None
    date: Optional[str] = None
    storage_unit: Optional[str] = None
    id_db : Optional[str] = None

class BaseArticleUserModel(BaseModel):
    id_product: int
    username: str
    quantity_vol: Optional[float] = None
    quantity_masse: Optional[float] = None
    localisation: Optional[str] = None
    date: Optional[str] = None

    class Config: 
        orm_mode = True

class UpdateArticleUserModel(BaseModel):
    quantity_vol: Optional[float] = None
    quantity_masse: Optional[float] = None
    localisation: Optional[str] = None
    date: Optional[str] = None



############ Hash Password ############

def hash_pass(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


@app.post("/login")
async def verify_login(username: str = Body(...), password: str = Body(...)):
    user_db = db_api.get_user(username)
    if not user_db:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    password_db = user_db.hashed_password
    if not password_db or not verify_password(password, password_db):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    return {"message": "Login successful"}

########## API ./users ##########


@app.post("/users/")
async def create_user(user: BaseUserModel):
    if db_api.get_user(user.username) is not None:
        raise HTTPException(status_code=409, detail="User already exists")
    user = User(
        username=user.username,
        mail=user.mail,
        hashed_password=user.hashed_password,
        user_type=user.user_type,
        localisation=user.localisation,
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
async def update_user(username: str, update_data: UpdateUserModel):
    user = db_api.get_user(username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    updated_fields = update_data.dict(exclude_unset=True)
    for key, value in updated_fields.items():
        setattr(user, key, value)

    db_api.update_user(user)
    return {"message": "User updated successfully"}



@app.delete("/users/{username}")
async def delete_user(username: str):
    db_api.delete_user(username)
    return {"message": "User deleted successfully"}


########## API ./users/article ##########


@app.post("/users/{username}/article_user/")
async def add_article_user(article_user_data: BaseArticleUserModel):
    # Assuming the ArticleUser ORM model requires all fields in BaseArticleUserModel for creation
    article_user = ArticleUser(**article_user_data.dict())
    db_api.create_article_user(article_user)
    return {"message": "Article added to user successfully"}



@app.get("/users/{username}/article_user/")
async def get_articles_user(username: str):
    articles = db_api.get_articles_user(username)
    return articles


@app.get("/users/{username}/article_user/{id_product}")
async def get_article_user(username: str, id_product: int):
    article = db_api.get_article_user(id_product, username)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@app.get("/users/article_user/{id_product}")
async def get_article_users(id_product: int):
    articles = db_api.get_article_users(id_product)
    return articles

@app.get("/article_user/")
async def get_all_articles_users():
    articles = db_api.get_all_articles_user()
    return articles

@app.delete("/users/{username}/article_user/{id_product}")
async def delete_article_user(username: str, id_product: int):
    db_api.delete_article_user(username, id_product)
    return {"message": "Article deleted from user successfully"}


@app.delete("/users/{username}/article_user/")
async def delete_all_articles_user(username: str):
    db_api.delete_all_articles_user(username)
    return {"message": "All articles deleted from user successfully"}


@app.put("/users/{username}/article_user/{id_product}")
async def update_article_user(
    username: str,
    id_product: int,
    article_user_data: UpdateArticleUserModel
):
    # Fetch the existing ArticleUser ORM model from the database
    article_user = db_api.get_article_user(id_product, username)
    if article_user is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Update the ORM model instance with data from the Pydantic model
    for field, value in article_user_data.dict(exclude_unset=True).items():
        setattr(article_user, field, value)
    
    db_api.update_article_user(article_user)
    return {"message": "Article updated successfully"}



########## API ./produit ##########


@app.post("/produit/")
async def create_produit(produit_data: BaseProduitModel):
    # Create an ORM model instance using dict unpacking
    produit = Produit(**produit_data.dict())
    db_api.create_produit(produit)
    return {"message": "Produit created successfully"}



@app.get("/produit")
async def get_produit(produit_id: int):
    produit = db_api.get_produit(produit_id)
    if produit is None:
        raise HTTPException(status_code=404, detail="Produit not found")
    return produit


@app.get("/produits/")
async def get_produits():
    produits = db_api.get_produits()
    return produits

@app.get("/produit/search")
async def search_produits(query: str):
    produits = db_api.search_produits(query)
    return produits


@app.put("/produit/{produit_id}")
async def update_produit(produit_id: int, produit_data: UpdateProduitModel):
    # Fetch the existing ORM model from the database
    initial_produit = db_api.get_produit(produit_id)
    if initial_produit is None:
        raise HTTPException(status_code=404, detail="Produit not found")
    
    # Update the ORM model instance with data from the Pydantic model
    for field, value in produit_data.dict(exclude_unset=True).items():
        setattr(initial_produit, field, value)
    
    db_api.update_produit(initial_produit)
    return {"message": "Produit updated successfully"}


# @app.put("/produit/{produit_id}")
# async def update_produit(
#     produit_id: int,
#     name="",
#     fabricant="",
#     score_danger= "",
#     cas_number= "",
#     quantity_masse=None,
#     quantity_vol=None,
#     description=None,
#     etat_physique=None,
#     cid_number=None,
#     phase_risque=None,
#     classif_sgh=None,
#     icpe=None,
#     pH=None,
#     temp_ebullition=None,
#     pression_vapeur=None,
#     code_tunnel=None,
#     danger_codes=None,
#     salle=None,
#     date=None,
#     storage_unit=None,
# ):
#     initial_produit = db_api.get_produit(produit_id)
#     if initial_produit is None:
#         raise HTTPException(status_code=404, detail="Produit not found")
#     produit = Produit(
#         id_product=produit_id,
#         name=name if name!="" else initial_produit.name,
#         fabricant=fabricant if fabricant !="" else initial_produit.fabricant,
#         score_danger=score_danger if score_danger !=-1 else initial_produit.score_danger,
#         cas_number=cas_number if cas_number !="" else initial_produit.cas_number,
#         quantity_masse=quantity_masse if quantity_masse is not None else initial_produit.quantity_masse,
#         quantity_vol=quantity_vol if quantity_vol is not None else initial_produit.quantity_vol,
#         description=description if description is not None else initial_produit.description, 
#         etat_physique=etat_physique if etat_physique is not None else initial_produit.etat_physique,
#         cid_number=cid_number if cid_number is not None else initial_produit.cid_number,
#         phase_risque=phase_risque if phase_risque is not None else initial_produit.phase_risque,
#         classif_sgh=classif_sgh if classif_sgh is not None else initial_produit.classif_sgh,
#         icpe=icpe if icpe is not None else initial_produit.icpe,
#         pH=pH if pH is not None else initial_produit.pH,
#         temp_ebullition=temp_ebullition if temp_ebullition is not None else initial_produit.temp_ebullition,
#         pression_vapeur=pression_vapeur if pression_vapeur is not None else initial_produit.pression_vapeur,
#         code_tunnel=code_tunnel if code_tunnel is not None else initial_produit.code_tunnel,
#         danger_codes=danger_codes if danger_codes is not None else initial_produit.danger_codes,
#         salle=salle if salle is not None else initial_produit.salle,
#         date=date if date is not None else initial_produit.date,
#         storage_unit=storage_unit if storage_unit is not None else initial_produit.storage_unit,
#     )
#     db_api.update_produit(produit)
#     return {"message": "Produit updated successfully"}


@app.delete("/produit/{produit_id}")
async def delete_produit(produit_id: int):
    db_api.delete_produit(produit_id)
    return {"message": "Produit deleted successfully"}


# Additional endpoints can be added here
