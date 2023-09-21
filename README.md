# Entity Framework Core:

## First install these packages:

- Microsoft.EntityFrameworkCore.Design 
- Microsoft.EntityFrameworkCore.SqlServer 
- Microsoft.Extensions.Configuration (5.0.0) 
- Microsoft.Extensions.Configuration.Json (5.0.0)


To open command line, to to Tools, Command Line then choose any of those

## Use the command to auto generate DBContext file and class files according to tables in database:

`dotnet ef dbcontext scaffold "Name=DrivingLicenseDB" Microsoft.EntityFrameworkCore.SqlServer --output-dir Models --project Driving_License`

## If make changes to database, use the following command:

`dotnet ef dbcontext scaffold "Name=DrivingLicenseDB" Microsoft.EntityFrameworkCore.SqlServer --output-dir Models --force --project Driving_License`

