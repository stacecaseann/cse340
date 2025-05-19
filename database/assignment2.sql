/* 1 */
INSERT INTO PUBLIC.ACCOUNT (
        ACCOUNT_FIRSTNAME,
        ACCOUNT_LASTNAME,
        ACCOUNT_EMAIL,
        ACCOUNT_PASSWORD
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
SELECT *
FROM PUBLIC.ACCOUNT
    /* 2 */
UPDATE PUBLIC.ACCOUNT
SET ACCOUNT_TYPE = 'Admin'
WHERE ACCOUNT_ID = 1;
/* 3 */
DELETE FROM PUBLIC.ACCOUNT
WHERE ACCOUNT_ID = 1;
SELECT *
FROM PUBLIC.INVENTORY
WHERE INV_ID = 10;
/* 4 */
UPDATE PUBLIC.INVENTORY
SET INV_DESCRIPTION = REPLACE(
        INV_DESCRIPTION,
        'small interiors',
        'a huge interior'
    )
WHERE INV_ID = 10;
/* 5 */
SELECT *
FROM public.inventory inv
    INNER JOIN public.classification c ON inv.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
/* 6 */
SELECT *
FROM public.inventory
    /*
     /images/camaro-tn.jpg
     */
UPDATE PUBLIC.INVENTORY
SET INV_IMAGE = REPLACE(
        INV_IMAGE,
        'images/',
        'images/vehicles/'
    ),
    INV_THUMBNAIL = REPLACE(
        INV_THUMBNAIL,
        'images/',
        'images/vehicles/'
    )