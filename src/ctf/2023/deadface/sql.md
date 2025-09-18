# SQL Challenges

## Setup Environment

Database dump is a MySql dump file, easiest way to recover it is to create database and use dump as source. Database sql file in `Aurora Compromise`.

```sql
└─# mariadb -u root -p
Enter password: 
...
Server version: 11.1.2-MariaDB Arch Linux
...

MariaDB [(none)]> CREATE DATABASE aurora;
Query OK, 1 row affected (0.001 sec)

MariaDB [(none)]> USE aurora;
Database changed
MariaDB [aurora]> SOURCE aurora.sql
...
Query OK, X rows affected (0.000 sec)
...

MariaDB [aurora]> SHOW TABLES;
+--------------------+
| Tables_in_aurora   |
+--------------------+
| billing            |
| credit_types       |
| drugs              |
| facilities         |
| insurors           |
| inventory          |
| orders             |
| patients           |
| positions          |
| positions_assigned |
| prescriptions      |
| staff              |
| suppliers          |
| transactions       |
+--------------------+
14 rows in set (0.000 sec)
```

## Aurora Compromise

Created by: **syyntax**

DEADFACE has taken responsibility for a partial database hack on a pharmacy tied to Aurora Pharmaceuticals. The hacked data consists of patient data, staff data, and information on drugs and prescriptions.

We’ve managed to get a hold of the hacked data. Provide the first and last name of the patient that lives on a street called Hansons Terrace.

Submit the flag as:  `flag{First Last}`.

[Download Database Dump](https://tinyurl.com/ytsdav3b)  
SHA1:  `35717ca5c498d90458478ba9f72557c62042373f`  

[Download System Design Specification](https://tinyurl.com/3z7zf9y9)  
SHA1:  `d6627aa2099a5707d34e26fc82bb532af6398575`

### Solution

```sql
SELECT
    @PatientName     := first_name,
    @PatientLastname := last_name
FROM patients
WHERE street LIKE '%Hansons Terrace%';

SELECT CONCAT(
    'flag{',
    @PatientName, ' ',
    @PatientLastname, '}'
) AS Flag;
```
::: tip Flag
`flag{Sandor Beyer}`
:::

## Foreign Keys

Created by: **syyntax**

How many foreign keys are described in the design of the inventory table?

Submit the flag as  `flag{#}`.

Use the database dump from  _**Aurora Compromise**_.

### Solution

If you take a look in the given spec you can easily find (in design or data models) that table **Inventory** has 2 foreign keys: drug_id, facility_id.

You can also find how many foreign keys the table has with following query:

```sql
SELECT COUNT(*)
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'aurora' -- Database Name
AND TABLE_NAME = 'inventory'  -- Table    Name
AND REFERENCED_TABLE_NAME IS NOT NULL;
```
::: tip Flag
`flag{2}`
:::

## Credit Compromise 

Created by: **syyntax**

How many credit cards were exposed in the Aurora database hack?

Submit the flag as  `flag{#}`.

Use the database dump from  _**Aurora Compromise**_.

### Solution

```sql
SELECT COUNT(*) FROM deadface_sql.billing;
```
::: tip Flag
`flag{10391}`
:::

## Starypax 

Created by: **syyntax**

Starypax (street name STAR) is a controlled substance and is in high demand on the Dark Web. DEADFACE might leverage this database to find out which patients currently carry STAR.

How many patients in the Aurora database have an active prescription for Starypax as of Oct 20, 2023? And whose prescription expires first?

Submit the flag as  `flag{#_firstname lastname}`.

Use the database dump from  _**Aurora Compromise**_.

### Solution

The hardest part of this challenge for me was understanding `as of Oct 20, 2023` 🤣, I thought it meant before october, but meant after...

```sql
SELECT drug_id FROM drugs  WHERE drug_name = 'Starypax';
+---------+
| drug_id |
+---------+
|      26 |
+---------+

SELECT 
     p.first_name,
     p.last_name,
     pr.date_prescribed,
     pr.expiration
FROM patients p
JOIN prescriptions pr
ON   p.patient_id = pr.patient_id
WHERE 
     pr.drug_id = 26 AND 
     pr.expiration > "2023-10-20"
ORDER BY pr.expiration
;

+------------+-----------+-----------------+------------+
| first_name | last_name | date_prescribed | expiration |
+------------+-----------+-----------------+------------+
| Renae      | Allum     | 2023-06-03      | 2023-10-26 |
| Chrissie   | Hargraves | 2023-06-25      | 2023-10-28 |
| Eolanda    | Maciaszek | 2023-06-24      | 2023-10-31 |
| Rodi       | Godfery   | 2023-05-16      | 2023-11-04 |
| Chic       | Abrashkov | 2023-06-12      | 2023-11-20 |
| Appolonia  | Benda     | 2023-06-20      | 2023-11-26 |
| Lenci      | Springett | 2023-06-23      | 2023-12-19 |
+------------+-----------+-----------------+------------+
7 rows in set (0.002 sec)
```
::: tip Flag
`flag{7_Renae Allum}`
:::

## Transaction Approved

Created by: **syyntax**

Turbo Tactical wants you to determine how many credit cards are still potentially at risk of being used by DEADFACE. How many credit cards in the Aurora database are NOT expired as of Oct 2023?

Submit the flag as  `flag{#}`.

Use the database dump from  _**Aurora Compromise**_.

### Solution

```sql
SELECT COUNT(*) FROM billing WHERE exp > "2023-10";
+----------+
| COUNT(*) |
+----------+
|     8785 |
+----------+
```
::: tip Flag
`flag{8785}`
:::

## Genovex Profits 

Created by: **syyntax**

Genovex, a pharmaceutical company, is concerned that DEADFACE will target their company based on how much money they made this year on prescriptions at the Aurora Health pharmacy. How much money did Genovex make in 2023 based on the Aurora database?

Submit the dollar value as the flag. Example:  `flag{$1234.56}`

Note: Round to the nearest hundredths.

Use the database dump from  _**Aurora Compromise**_.

### Solution

```sql
SELECT SUM(drugs.cost) AS "Genovex Total Income"
FROM prescriptions
JOIN drugs
ON prescriptions.drug_id = drugs.drug_id
WHERE drugs.supplier_id = ( -- Grab Supplier Dynamically
    SELECT supplier_id 
    FROM suppliers 
    WHERE supplier_name = 'Genovex'
) 
AND date_prescribed LIKE '2023%'
;

+----------------------+
| Genovex Total Income |
+----------------------+
|   19249.880025863647 |
+----------------------+
```
::: tip Flag
`flag{$19249.88}`
:::

## City Hoard 

Created by: **syyntax**

Aurora is asking for help in determining which city has the facility with the largest inventory of Remizide based on the Aurora database.

Submit the flag as  `flag{city}`.

Use the database dump from  _**Aurora Compromise**_.

### Solution

```sql
SELECT f.city, SUM(i.qty) AS qty
FROM deadface_sql.inventory  i
JOIN deadface_sql.facilities f
ON   i.facility_id = f.facility_id
WHERE drug_id = ( -- Grab Drug Id Dynamically
    SELECT drug_id 
    FROM deadface_sql.drugs 
    WHERE drug_name = 'Remizide'
)
GROUP BY f.facility_id
ORDER BY qty DESC
LIMIT 3
;

+---------+------+
| city    | qty  |
+---------+------+
| Miami   | 2999 |
| Tulsa   | 2996 |
| Seattle | 2992 |
+---------+------+
```
::: tip Flag
`flag{Miami}`
:::

## Order Up

Created by: **syyntax**

Dr. Flegg prescribed Automeda to a patient in June 2023. What is the order number for this prescription?

Submit the flag as  `flag{order_num}`.

Use the database dump from  _**Aurora Compromise**_.

### Solution

```sql
SELECT order_num
FROM orders
WHERE prescription_id = ( -- Get Prescription Id
    SELECT prescription_id
    FROM prescriptions
    WHERE 
        doctor_id = ( -- Get Doctor Id
            SELECT staff_id 
            FROM staff
            WHERE last_name = 'Flegg'
        )
        AND
        drug_id = ( -- Get Drug Id
            SELECT drug_id
            FROM drugs 
            WHERE drug_name = 'Automeda'
        )
        AND 
        date_prescribed LIKE "%-06-%" 
);

+------------------+
| order_num        |
+------------------+
| DYP8AXK3QG9OTPWB |
+------------------+
```
::: tip Flag
`flag{DYP8AXK3QG9OTPWB}`
:::

## Counting STARs

Created by: **syyntax**

We know DEADFACE is trying to get their hands on STAR, so it makes sense that they will try to target the doctor who prescribes the most STAR from the Aurora database. Provide the first and last name and the type of doctor (position name) that prescribed the most STAR from the database.

Submit the flag as  `flag{FirstName LastName Position}`.

For example:  `flag{John Doe Podiatrist}`

Use the database dump from  _**Aurora Compromise**_.

### Solution

From Starypax: `Starypax (street name STAR)` meaning we need Starypax drug.

```sql
SELECT @Starypax := drug_id # Save Drug Id
FROM deadface_sql.drugs 
WHERE drug_name = 'Starypax'
;

# Save Doctor Id
SELECT @DoctorStarypax := doctor_id, COUNT(prescription_id) prescription_count
FROM deadface_sql.prescriptions
WHERE drug_id = @Starypax
GROUP BY doctor_id
ORDER BY prescription_count DESC
LIMIT 1
;

# Save Doctor Position
SELECT @DoctorStarypaxPosition := position_name
FROM deadface_sql.positions
WHERE position_id = (
    SELECT position_id
    FROM deadface_sql.positions_assigned
    WHERE staff_id = @DoctorStarypax
)
;

# Profit
SELECT CONCAT(
    'flag{', 
    first_name, ' ', 
    last_name, ' ', 
    @DoctorStarypaxPosition, '}'
) AS Flag 
FROM deadface_sql.staff
WHERE staff_id = @DoctorStarypax
;

+---------------------------------------+
| Flag                                  |
+---------------------------------------+
| flag{Alisa MacUchadair Dermatologist} |
+---------------------------------------+
```
::: tip Flag
`flag{Alisa MacUchadair Dermatologist}`
:::

## Clean Up on Aisle 5 

Created by: **syyntax**

Based on Ghost Town conversations, DEADFACE is going to try to compromise an Aurora Health pharmacy to get their hands on STAR. Turbo Tactical wants to provide security personnel at Aurora with information about which facility, aisle, and bin contains the most STAR, since it is likely what DEADFACE will target.

Provide the facility_id, aisle, and bin where the most STAR is kept in the city DEADFACE is targeting. Submit the flag as  `flag{facility_id-aisle-bin}`.

Example:  `flag{123-4-8}`

Use the database dump from  _**Aurora Compromise**_.

### Solution

Some osint is required for this challenge. Visit [Ghost Town](https://ghosttown.deadface.io) and try to find post which matches given description.

Top -> [Get after those northern lights](https://ghosttown.deadface.io/t/get-after-those-northern-lights/103) ->   
**lilith**: _Umm let me check… There are a bunch of facilities in Phoenix. I’d have to look at which ones have the most STAR._

For "aisle" and "bin" you need to refer the given spec, in the Inventory description you can find:

> **locator**: The aisle (represented as “A”) and the bin (represented as “B”) where the drug is stored in the associated facility. 

```sql
DELIMITER //

CREATE FUNCTION IF NOT EXISTS Extract_Aisle(input VARCHAR(24))
RETURNS VARCHAR(24)
BEGIN
    DECLARE aisle VARCHAR(24);
    SET aisle = SUBSTRING_INDEX(SUBSTRING_INDEX(input, 'A', -1), 'B', 1);
    RETURN aisle;
END// 

CREATE FUNCTION IF NOT EXISTS Extract_Bin(input VARCHAR(24))
RETURNS VARCHAR(24)
BEGIN
    DECLARE result VARCHAR(24);
    SET result = SUBSTRING_INDEX(input, 'B', -1);
    RETURN result;
END//

DELIMITER ;

-- Defined functions to make parsing easier

SELECT @Starypax := drug_id -- Get drug id
FROM drugs 
WHERE drug_name = 'Starypax' 
;

-- Get locator and facility id
SELECT @StarypaxFacilityLocator := i.locator, @StarypaxFacilityID := i.facility_id
FROM inventory i
JOIN facilities f
ON   i.facility_id = f.facility_id
WHERE drug_id = @Starypax -- Starypax drug id
AND  f.city = 'Phoenix'   -- City found from Ghost Town post
ORDER BY qty DESC
LIMIT 1;

SELECT CONCAT( -- Profit
    'flag{',
    @StarypaxFacilityID, '-',
    Extract_Aisle(@StarypaxFacilityLocator), '-',
    Extract_Bin(@StarypaxFacilityLocator), '}'
) AS Flag;

+-----------------+
| Flag            |
+-----------------+
| flag{412-11-44} |
+-----------------+
```
::: tip Flag
`flag{412-11-44}`
:::

## SHAttered Dreams 

Created by: **syyntax**

DEADFACE is on the brink of selling a patient's credit card details from the Aurora database to a dark web buyer. Investigate Ghost Town for potential leads on the victim's identity.

Submit the flag as  `flag{Firstname Lastname}`. Example:  `flag{John Smith}`.

Use the database dump from  _**Aurora Compromise**_.

### Solution

Go to [Ghost Town](https://ghosttown.deadface.io) -> Top -> [We got a potential buyer](https://ghosttown.deadface.io/t/we-got-a-potential-buyer/107)

> **lilith**: I’ll let him know! I told him to put this SHA1 hash in the notes of the transaction so we have a record of what was sold: `911d1fc5930fa5025dbc2d3953c94de9e4773584`
> ...
> No I’m actually including almost the full billing and patient data. I’m just concatenating the following: card number, expiration, CCV, patient_id, patient first name, patient last name, patient middle initial, patient sex, patient email, patient address (street, city, state, zip), patient dob

```sql
SELECT 
    @BuyerFirstname := first_name AS FirstName,
    @BuyerLastname  := last_name  AS LastName,
    buyer
FROM (
    SELECT 
        p.first_name, p.last_name,
        SHA1(CONCAT( # Create Hash
            b.card_num, b.exp, b.ccv,
            p.patient_id, p.first_name, p.last_name,
            p.middle, p.sex, p.email, 
            p.street, p.city, p.state, p.zip, p.dob
        )) AS buyer
    FROM patients p
    JOIN billing  b
    ON p.patient_id = b.patient_id
) AS subquery
WHERE buyer = '911d1fc5930fa5025dbc2d3953c94de9e4773584'; # Find Buyer

SELECT CONCAT( # Profit
    'flag{',
    @BuyerFirstname, ' ', 
    @BuyerLastname, '}'
) AS Flag;

+-----------------------+
| Flag                  |
+-----------------------+
| flag{Berton Luchetti} |
+-----------------------+
```
::: tip Flag
`flag{Berton Luchetti}`
:::