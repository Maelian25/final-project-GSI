import pandas as pd 
import re
import requests
import xml.etree.ElementTree as ET

async def convert_cas_to_cid(cas_number):
    try:
        url = f"https://www.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pccompound&retmax=1&term={cas_number}"
        response = requests.get(url)
        data = response.text

        # Parse the XML response
        xml = ET.fromstring(data)
        cid = xml.find(".//IdList/Id").text if xml.find(".//IdList/Id") is not None else None

        return cid
    except Exception as error:
        print("Error converting CAS to CID:", error)
        return None


csv= pd.read_csv("product.csv")

###renommer la colonne "name " en "name"
try:
    csv.rename(columns={"name ": 'name'}, inplace=True)
except:
    pass
###renommer la colonne "quatity_masse" en "quantity_masse"
try:
    csv.rename(columns={"quatity_masse": 'quantity_masse'}, inplace=True)
except:
    pass

###renommer la colonne "Fabricant" en "fabricant"
try:
    csv.rename(columns={"Fabricant": 'fabricant'}, inplace=True)
except:
    pass
###renommer la colonne "Score Danger" en "score_danger"
try:
    csv.rename(columns={"Score Danger": 'score_danger'}, inplace=True)
except:
    pass
###renommer la colonne "État physique" en "etat_physique"
try:
    csv.rename(columns={"État physique": 'etat_physique'}, inplace=True)
except:
    pass
###renommer la colonne "Classif. SGH" en "classif_sgh"
try:
    csv.rename(columns={"Classif. SGH": 'classif_sgh'}, inplace=True)
except:
    pass
###renommer la colonne "ICPE" en "icpe"
try:
    csv.rename(columns={"ICPE": 'icpe'}, inplace=True)
except:
    pass
###renommer la colonne "Temp_ébullition" en "temp_ebullition"
try:
    csv.rename(columns={"Temp_ébullition": 'temp_ebullition'}, inplace=True)
except:
    pass
try:
    csv.rename(columns={"id_product": 'id_db'}, inplace=True)
except:
    pass




liste_to_float=["quantity_masse","quantity_vol","pH"]
liste_to_integer=["score_danger"]
liste_to_string=["description","name","cas_number","etat_physique","phase_risque","classif_sgh","icpe","code_tunnel"]

liste_type=[]

#remplacer toute les lignes d'une colonne par la string correspondant
for colonne in liste_to_string:
    csv[colonne] = csv[colonne].apply(lambda x: " " if pd.isna(x) else str(x))

for colonne in liste_to_string:
    for indice in range(0,len(csv[colonne])):
        if pd.isna(csv[colonne][indice]):
            csv[colonne][indice]=" "
        else:
             csv[colonne][indice]=str(csv[colonne][indice])
## fonction prenant en entrée une variable et renvoie soit le float 
# correspondant si c'est un int ou str, elle renvoie une erreure si le type est autre que
# string, float, int


# def to_float(i):       
#     if type(i)== str and not pd.isna(i) :
#             # print(i)
            
#         if "," in i:
#             a=re.search(",",i)
#             i=i[:a.start()]+"."+i[a.end():]
#         try:       
#             return(float(i))
#         except: 
#             print(f"valeur string problematique  {i}")
#             raise ValueError
#     elif pd.isna(i):
#         return(0.0)
    
#     elif type(i)== float or type(i)==int:
#         return((float(i)))
#     else:
#         print(f"type_erreure pour {i}")
#         raise ValueError

# for i in csv["quantity_masse"]:
#     if pd.isna(i):
#         print(i)
#         break

# for colonne in liste_to_float:
#     for indice in range(0,len(csv[colonne])):
#         if pd.isna(csv[colonne][indice]):
#             csv[colonne][indice]=0.0
#         else:
#             csv[colonne][indice]=to_float(csv[colonne][indice])
    
def to_number(value, target_type):
    if pd.isna(value):
        return 0 if target_type == int else 0.0
    elif isinstance(value, str):
        # Clean the string
        value = value.strip()
        if "," in value:
            value = value.replace(",", ".")
        if target_type == int:
            try:
                # For integers, convert to float first to handle strings like "1.0"
                return int(float(value))
            except ValueError:
                print(f"Value cannot be converted to integer: {value}")
                raise
        else:
            try:
                return float(value)
            except ValueError:
                print(f"Value cannot be converted to float: {value}")
                raise
    elif isinstance(value, (float, int)):
        return target_type(value)
    else:
        print(f"Unexpected type for value: {value}")
        raise TypeError

# Convert the specific columns to integers and floats
for column in liste_to_float:
    csv[column] = csv[column].apply(lambda x: to_number(x, float))

for column in liste_to_integer:
    csv[column] = csv[column].apply(lambda x: to_number(x, int))


##enregistrer le dataset modifier dans un nv fichier
## Add cid_number column
    
csv['cid_number'] = csv['cas_number'].apply(lambda x: convert_cas_to_cid(x))

print(csv.columns)

print(csv.head(5))

csv = csv.drop('temp_ebullition', axis=1)
csv = csv.drop('pression_vapeur', axis=1)

csv = csv.dropna(subset=['id_db'])
## csv.to_csv("donnee.csv", sep=',', index=False, encoding='utf-8')

import requests
from requests.exceptions import HTTPError

# Use .head() to test with the first 5 lines
test_csv = csv.head(2)

# Define the API endpoint
api_endpoint = "http://127.0.0.1:8000/produit/"

# Headers to indicate that the payload is JSON
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

def fetch_existing_ids():
    try:
        response = requests.get(api_endpoint, headers=headers)
        response.raise_for_status()
        products = response.json()
        return {product['id_db'] for product in products if 'id_db' in product}
    except HTTPError as http_err:
        print(f"HTTP error occurred while fetching products: {http_err}")
        return set()
    except Exception as err:
        print(f"An error occurred while fetching products: {err}")
        return set()


existing_ids = fetch_existing_ids()

total_attempts = 0
failed_attempts = 0

exit()

# Iterate through the DataFrame rows
for index, row in csv.iterrows():
    id_db = row['id_db']
    if id_db not in existing_ids:
        total_attempts += 1
        data = row.dropna().to_dict()

        try:
            response = requests.post(api_endpoint, json=data, headers=headers)
            response.raise_for_status()
            existing_ids.add(id_db)  # Add the id_db to the set of existing IDs
            print(f"Product added. Response: {response.json()}")
        except HTTPError as http_err:
            print(f"HTTP error occurred: {http_err} for row index {index}")
            failed_attempts += 1
            print(f"Failed data: {data}")
        except Exception as err:
            print(f"An error occurred: {err} for row index {index}")
            failed_attempts += 1
    else:
        print(f"Product with id_db {id_db} already exists, skipping.")

# Calculate and display statistics
if total_attempts > 0:
    failure_percentage = (failed_attempts / total_attempts) * 100
    print(f"Total products processed (excluding existing): {total_attempts}")
    print(f"Total failed attempts: {failed_attempts}")
    print(f"Failure rate: {failure_percentage:.2f}%")
else:
    print("No new products were processed.")
