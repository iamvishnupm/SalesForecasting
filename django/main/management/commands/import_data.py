import csv
from django.core.management.base import BaseCommand
from main.models import SalesData


class Command(BaseCommand):
    help = "Import sales data from a CSV file"

    def add_arguments(self, parser):
        parser.add_argument("csv_file", type=str, help="The path to the CSV file")

    def handle(self, *args, **kwargs):
        csv_file = kwargs["csv_file"]

        with open(csv_file, "r") as file:
            reader = csv.DictReader(file)
            row_count = sum(1 for row in reader)  # Get total row count for display
            file.seek(0)  # Reset reader to start after counting

            self.stdout.write(f"Importing {row_count} rows...\n")

            # Skip the header row if needed
            next(reader, None)  # This skips the header row

            # Process each row and show progress
            for i, row in enumerate(reader, start=1):
                try:
                    SalesData.objects.create(
                        Date=row["Date"],
                        Country=row["Country"],
                        Place=row["Place"],
                        Product_ID=row["Product_ID"],
                        Category=row["Category"],
                        Price=float(row["Price"]),
                        Discount=float(row["Discount"]),
                        Quantity_Sold=int(row["Quantity_Sold"]),
                        Customer_Rating=float(row["Customer_Rating"]),
                        Total_Sales=float(row["Total_Sales"]),
                    )

                    # Display progress in place
                    print(f"Rows processed: {i}/{row_count}", end="\r")

                except ValueError as e:
                    self.stdout.write(
                        self.style.WARNING(f"\nSkipping row {i} due to error: {e}")
                    )
                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(
                            f"\nSkipping row {i} due to unexpected error: {e}"
                        )
                    )

            self.stdout.write(self.style.SUCCESS("\nData imported successfully!"))
