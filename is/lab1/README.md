# Getting started
1. Initialize database, start server to apply data schemas (for now we don't use migrations until we have stable db structure and production version in order and not to create a lot of meaningless migrations )
2. Run db seed `npm run db:seed`
3. You are good to go!

# Typerom version
Typerom version is intentionally chosen `"typeorm": "0.3.17",`, greater version will break VirtualColumns

# Generating migrations

Run 

```npm run migration:create --name=test```

to create blank migraiton file or

```npm run migration:generate --name=test```

to create migration based on your current db state

where `name` is the name of migration