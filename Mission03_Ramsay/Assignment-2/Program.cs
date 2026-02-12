using Assignment_2;

internal class Program
{
    private static void Main(string[] args)
    {
        List<FoodItem> foodItems = new();

        while (true)
        {
            Console.WriteLine("1. Add Food Item");
            Console.WriteLine("2. Delete Food Items");
            Console.WriteLine("3. View Food Items");
            Console.WriteLine("4. Exit");
            Console.Write("Enter your choice: ");
            int choice = int.TryParse(Console.ReadLine(), out int result) ? result : 0;

            switch (choice)
            {
                case 0:
                    Console.WriteLine("Invalid choice. Please try again.");
                    break;
                case 1:
                    Console.WriteLine("Enter name: ");
                    string name = Console.ReadLine() ?? string.Empty;
                    
                    if (string.IsNullOrWhiteSpace(name))
                    {
                        Console.WriteLine("Name cannot be empty. Please try again.");
                        break;
                    }

                    Console.WriteLine("Enter category: ");
                    string category = Console.ReadLine() ?? string.Empty;
                    
                    if (string.IsNullOrWhiteSpace(category))
                    {
                        Console.WriteLine("Category cannot be empty. Please try again.");
                        break;
                    }

                    Console.WriteLine("Enter quantity: ");
                    int quantity = int.TryParse(Console.ReadLine(), out int qtyResult) ? qtyResult : -1;
                    
                    if (qtyResult <= 0)
                    {
                        Console.WriteLine("Quantity must be a positive integer. Please try again.");
                        break;
                    }

                    Console.WriteLine("Enter expiration date (yyyy-MM-dd): ");
                    DateTime expirationDate = DateTime.TryParse(Console.ReadLine(), out DateTime dateResult) ? dateResult : DateTime.MinValue;

                    if (dateResult == DateTime.MinValue || dateResult < DateTime.Now)
                    {
                        Console.WriteLine("Invalid expiration date. Please try again.");
                        break;
                    }

                    foodItems.Add(new FoodItem(name, category, quantity, expirationDate));

                    Console.WriteLine("Food item added successfully.");

                    break;

                case 2:
                    if (foodItems.Count == 0)
                    {
                        Console.WriteLine("No food items to delete.");
                        break;
                    }

                    // List all food items with indices
                    foreach (var item in foodItems.Select((value, index) => new { index, value }))
                    {
                        Console.WriteLine($"{item.index + 1}. {item.value}");
                    }

                    // Prompt user for index to delete
                    Console.WriteLine("Enter the index of the food item to delete: ");
                    int deleteIndex = int.TryParse(Console.ReadLine(), out int delResult) ? delResult - 1 : -1;

                    if (deleteIndex < 0 || deleteIndex >= foodItems.Count)
                    {
                        Console.WriteLine("Invalid index. Please try again.");
                        break;
                    }

                    foodItems.RemoveAt(deleteIndex);

                    Console.WriteLine("Food item deleted successfully.");

                    break;

                case 3:
                    if (foodItems.Count == 0)
                    {
                        Console.WriteLine("No food items in inventory.");
                        break;
                    }

                    Console.WriteLine("\n--- Current Food Items ---");
                    foreach (var item in foodItems.Select((value, index) => new { index, value }))
                    {
                        Console.WriteLine($"{item.index + 1}. {item.value}");
                    }
                    Console.WriteLine();
                    break;

                case 4:
                    Console.WriteLine("Thank you for using the Food Bank Inventory System. Goodbye!");
                    return;

                default:
                    Console.WriteLine("Invalid choice. Please try again.");
                    break;
            }
        }
    }
}