using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace Assignment_2
{
    internal class FoodItem
    {
        private string name;
        private string category;
        private int quantity;
        private DateTime expirationDate;

        public FoodItem(string name, string category, int quantity, DateTime expirationDate)
        {
            // Validate inputs
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name cannot be null or empty.", nameof(name));
            if (string.IsNullOrWhiteSpace(category))
                throw new ArgumentException("Category cannot be null or empty.", nameof(category));
            if (quantity < 0)
                throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity cannot be negative.");
            if (expirationDate < DateTime.Now)
                throw new ArgumentOutOfRangeException(nameof(expirationDate), "Expiration date cannot be in the past.");

            this.name = name;
            this.category = category;
            this.quantity = quantity;
            this.expirationDate = expirationDate;
        }
        public override string ToString()
        {
            return $"{name} ({category}) - Quantity: {quantity}, Expires on: {expirationDate.ToShortDateString()}";
        }
    }
}
