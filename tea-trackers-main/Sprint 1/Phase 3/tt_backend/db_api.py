from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    username = Column(String, primary_key=True)
    mail = Column(String, nullable=False)
    hashed_password = Column(String, nullable=True)
    user_type = Column(String, nullable=False)
    localisation = Column(String, nullable=True)

    def __repr__(self):
        return f"<User(username={self.username}, mail={self.mail})>"
    
class ArticleUser(Base):
    __tablename__ = 'article_user'   
    id_article_user = Column(Integer, primary_key=True, nullable=False)
    id_product = Column(Integer, nullable=False)
    username = Column(Integer, nullable=False)
    quantity_vol = Column(Integer)
    quantity_masse = Column(Integer)
    localisation = Column(String)
    date = Column(String)

    def __repr__(self):
        return f"<ArticleUser(id_product={self.id_product}, id_user={self.id_user})>"

class Produit(Base):
    __tablename__ = 'produits'
    id_product = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    fabricant = Column(String, nullable=False)
    quantity_masse = Column(Integer)
    quantity_vol = Column(Integer)
    score_danger = Column(String, nullable=False)
    description = Column(String)
    cas_number = Column(String, nullable=False)
    etat_physique = Column(String)
    cid_number = Column(String)
    phase_risque = Column(String)
    classif_sgh = Column(String)
    icpe = Column(String)
    pH = Column(String)
    temp_ebullition = Column(String)
    pression_vapeur = Column(String)
    code_tunnel = Column(String)
    danger_codes = Column(String)
    salle = Column(String)
    date = Column(String)
    storage_unit = Column(String)


    def __repr__(self):
        return f"<Produit(id_product={self.id_product}, name={self.name})>"



# Database API
class DatabaseAPI:
    def __init__(self, connection_string):
        self.engine = create_engine(connection_string)
        self.Session = sessionmaker(bind=self.engine)

    ######## USER #########

    def create_user(self, user: User):
        session = self.Session()
        session.add(user)
        session.commit()
        session.refresh(user)
        session.close()

    def get_user(self, username: str):
        session = self.Session()
        user = session.query(User).filter_by(username=username).first()
        session.close()
        return user

    def get_users(self):
        session = self.Session()
        users = session.query(User).all()
        session.close()
        return users
    
    def update_user(self, user: User):
        session = self.Session()
        session.merge(user)
        session.commit()
        session.close()
    
    def delete_user(self, username: str):
        session = self.Session()
        user = session.query(User).filter_by(username=username).first()
        session.delete(user)
        session.commit()
        session.close()

    ######## PRODUIT_USER #########
    
    def create_article_user(self, article_user: ArticleUser):
        session = self.Session()
        session.add(article_user)
        session.commit()
        session.refresh(article_user)
        session.close()
    
    def get_article_user(self, id_product: int, id_user: int):
        session = self.Session()
        article_user = session.query(ArticleUser).filter_by(id_product=id_product, id_user=id_user).first()
        session.close()
        return article_user

    def get_articles_user(self, username: int):
        session = self.Session()
        articles_user = session.query(ArticleUser).filter_by(username=username).all()
        session.close()
        return articles_user
    
    def get_article_users(self, id_product: int):
        session = self.Session()
        articles_user = session.query(ArticleUser).filter_by(id_product=id_product).all()
        session.close()
        return articles_user
    
    def update_article_user(self, article_user: ArticleUser):
        session = self.Session()
        session.merge(article_user)
        session.commit()
        session.close()

    def delete_article_user(self, id_product: int, id_user: int):
        session = self.Session()
        article_user = session.query(ArticleUser).filter_by(id_product=id_product, id_user=id_user).first()
        session.delete(article_user)
        session.commit()
        session.close()

    def delete_all_articles_user(self, id_user: int):
        session = self.Session()
        articles_user = session.query(ArticleUser).filter_by(id_user=id_user).all()
        for article_user in articles_user:
            session.delete(article_user)
        session.commit()
        session.close()
    
    ######## PRODUIT #########

    def create_produit(self, produit: Produit):
        session = self.Session()
        session.add(produit)
        session.commit()
        session.refresh(produit)
        session.close()
    
    def get_produit(self, id_product: int):
        session = self.Session()
        produit = session.query(Produit).filter_by(id_product=id_product).first()
        session.close()
        return produit
    
    def get_produits(self):
        session = self.Session()
        produits = session.query(Produit).all()
        session.close()
        return produits
    
    def update_produit(self, produit: Produit):
        session = self.Session()
        session.merge(produit)
        session.commit()
        session.close()
    
    def delete_produit(self, id_product: int):
        session = self.Session()
        produit = session.query(Produit).filter_by(id_product=id_product).first()
        session.delete(produit)
        session.commit()
        session.close()
    





# Replace with your actual database connection details
DATABASE_URL = "mssql+pyodbc://admin_ttdb:TeaTrackers_db_pass.?@ttdb.database.windows.net/tea-trackersbd?driver=ODBC+Driver+18+for+SQL+Server"
db_api = DatabaseAPI(DATABASE_URL)

# Create tables in the database (this should be run once)
Base.metadata.create_all(db_api.engine)
