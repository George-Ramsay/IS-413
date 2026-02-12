using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assignment_1
{
    internal class DiceRoller
    {
        private static Random random = new Random();

        public int[] RollDice(int numRolls)
        {
            int[] roll = new int[13];

            for (int i = 0; i < numRolls; i++)
            {
                int die1 = random.Next(1, 7);
                int die2 = random.Next(1, 7);
                int sum = die1 + die2;
                roll[sum]++;
            }

            return roll;
        }
    }
}