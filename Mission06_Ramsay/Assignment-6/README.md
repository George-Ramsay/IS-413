Mission #6 Assignment
IS 413 – Hilton
Our (pretend) client this week is Joel Hilton (my brother, who is 2 years, 2 months,
and 2 days younger than myself), and who is also very into film. So into film, in
fact, that he minored in Film Studies at BYU, contracts as a movie reviewer for
ClearPlay, and does a weekly podcast about films & pop culture called Baconsale.
Joel needs a system to keep track of his ever-expanding movie collection. He only
allows movies he deems worthy into his collection. As his collection began to
grow, he created a spreadsheet to keep track of all his info. (NOTE: When I asked
him if it was okay if I used his movie collection spreadsheet as an example for my
assignment this week, he wanted to make sure it was understood to my students
that he did marry into a few of these films! *cough*Pride & Prejudice*cough*)
Currently, he is keeping track of the information in a Google Sheet:
https://docs.google.com/spreadsheets/d/1q-eBsTN7KHcCY2cdVDm98qccSxQnP5ZzkDVDgl5kTc/edit?usp=sharing
He needs a web app to be able to more easily enter and keep track of and share his
movie collection as it continues to grow. Build a ASP.NET web app that has:
• A shared navigation menu to each page on the site
• A home page containing the title “The Joel Hilton Film Collection” and the
only image I could find of him on the Internet:
o https://byu.box.com/s/8sjz2qei13h4nnlw0e6gc10ot35octkf
• A separate “Get to Know Joel” page with:
o A link to Quick Wits Comedy (where he performs regularly):
▪ https://www.qwcomedy.com/
o A link to the Baconsale site:
▪ https://baconsale.com/
o This photo that also links to the Baconsale site when clicked:
▪ https://byu.box.com/s/ie6ibeddqm0f6oudp7bc5dyt87zxi2u4
• One last page with a form to enter movies into the collection. The new movie
form should allow to enter all the information currently contained in the
spreadsheet linked above. Please note:
o For the Rating field, use a dropdown menu (G, PG, PG-13, R).
o For the Edited field, we want that to be a yes/no (true/false) option.
o The “Edited”, “Lent To”, and “Notes” are not required to create a new
record. All other fields must be entered.
o Notes should be limited to 25 characters. (#notcoveredinthevideos)
• Create a SQLite database using the Model First method that stores the
information entered on the form.
o Use good normalization principles
• Add at least three of your favorite movies into the database
o (NOTE: No need to import the movies from the sheet yet.)
As always, write good, clean code.
As you build your project, please make sure to use the following format:
“Mission06_LastName”. Submit a PUBLIC link to the GitHub repository
containing your project via Learning Suite.