---
title: 'Reporting'
---

> No good data, no glory.

---

## Overview

Truust offers 3 main ways to get clean information: API, Dashboard, external Business Intelligence tool.

![Reporting](/assets/reporting.png)

## API GET

Each account fetches its own data via API.

## Dashboard: Operational reports

Search, filter and select columns for every report which can be exported to CSV files:

- Orders, Payins/Payouts. Customers, Sellers, Wallets, etc.
- No ETL is applied

## External Business Intelligence tool

The Merchant connects a BI tool to Truust flat table in order to build its own data analytics:

1. ETL (extract, transform and load). Ie: Order.metadata field deserialization.
2. Custom reports and CSV export.
3. Email server integration
4. Analytical Visualization