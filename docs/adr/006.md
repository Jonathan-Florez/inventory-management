# ADR-006: bcrypt pineado a 4.0.1

## Contexto
passlib==1.7.4 última versión estable, sin mantenimiento activo desde
2020 intenta leer bcrypt.__about__.__version__ para autodetectar la
versión de bcrypt instalada. Las versiones de bcrypt ≥ 4.1.0 eliminaron ese
atributo, causando que passlib caiga en una ruta de autodiagnóstico que
falla con ValueError: password cannot be longer than 72 bytes incluso con
contraseñas cortas.

## Decisión
bcrypt se pinea explícitamente a 4.0.1 — la última versión que aún
expone __about__.__version__, evitando la ruta de código rota en passlib.

## Alternativas consideradas
- Migrar de passlib a bcrypt directo o argon2-cffi: resolvería el
  problema, pero es un cambio de librería innecesario dado que
  pinear la versión es un fix conocido, documentado y de una línea.

## Consecuencias
- Reproducibilidad garantizada: cualquiera que clone el repo e instale
  requirements.txt obtiene el mismo comportamiento, sin toparse con este
  bug de compatibilidad.
- Deuda técnica documentada: si en el futuro se actualiza passlib a una
  versión que resuelva esto, se puede destrabar la versión de bcrypt.