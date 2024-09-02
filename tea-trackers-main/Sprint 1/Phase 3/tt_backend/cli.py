import typer
from .db_api import db_api, User

# """Backend command cli to start uvicorn rest api."""

# import typer
# import uvicorn

# cli_app = typer.Typer()


# @cli_app.command()
# def cli(
#     host: str = "localhost", port: int = 9456, root_path: str = "", workers: int = 1
# ):
#     """Backend client launcher with developer configuration."""
#     uvicorn.run(
#         "blog_backend.blog_api:app",
#         host=host,
#         port=port,
#         root_path=root_path,
#         workers=workers,
#         reload=True,
#     )



app = typer.Typer()

@app.command()
def create_user(name: str, age: int):
    user = User(name=name, age=age)
    db_api.create_user(user)
    print(f"User {name} created successfully")

if __name__ == "__main__":
    app()

