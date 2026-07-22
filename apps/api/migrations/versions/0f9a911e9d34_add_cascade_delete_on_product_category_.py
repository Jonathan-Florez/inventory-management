"""añadimos ondelete="CASCADE" a las llaves foráneas de product.category_id y movement.product_id para que al eliminar una categoría se eliminen sus productos y al eliminar un producto se eliminen sus movimientos asociados

Revision ID: 0f9a911e9d34
Revises: 8fb8449266a5
Create Date: 2026-07-21 16:33:03.403944

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


revision = '0f9a911e9d34'
down_revision = '8fb8449266a5'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint('movements_product_id_fkey', 'movements', type_='foreignkey')
    op.create_foreign_key(
        'movements_product_id_fkey', 'movements', 'products',
        ['product_id'], ['id'], ondelete='CASCADE'
    )
    op.drop_constraint('products_category_id_fkey', 'products', type_='foreignkey')
    op.create_foreign_key(
        'products_category_id_fkey', 'products', 'categories',
        ['category_id'], ['id'], ondelete='CASCADE'
    )


def downgrade() -> None:
    op.drop_constraint('products_category_id_fkey', 'products', type_='foreignkey')
    op.create_foreign_key(
        'products_category_id_fkey', 'products', 'categories', ['category_id'], ['id']
    )
    op.drop_constraint('movements_product_id_fkey', 'movements', type_='foreignkey')
    op.create_foreign_key(
        'movements_product_id_fkey', 'movements', 'products', ['product_id'], ['id']
    )