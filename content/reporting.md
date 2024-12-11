---
title: 'Reporting'
---

> "No good data, no glory."

## Overview

Truust provides three main methods for acquiring clean and organized data: API, Dashboard, and integration with external Business Intelligence (BI) tools.

![Reporting Diagram](/assets/reporting.png)

## API - GET Method

Each account has the capability to retrieve its specific data through API access.

## Dashboard: Operational Reports

The dashboard allows users to search, filter, and select columns for various reports. These reports can be exported to CSV files, covering data segments such as:

- Orders, Pay-ins/Pay-outs, Customers, Sellers, Wallets, etc.
- It's important to note that no ETL (Extract, Transform, Load) process is applied to this data directly within the dashboard.

## External Business Intelligence Tool Integration

Merchants can connect their BI tools to Truust's databases to create custom reports, perform data analytics, and export data:

1. ETL (Extract, Transform, Load) processes—Example: Serialization of the Order.metadata field.
2. Creation of custom reports and options for CSV export.
3. Integration with email servers for enhanced communication and data sharing.
4. Advanced analytical visualizations to understand data better.