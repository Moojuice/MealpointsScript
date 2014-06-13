Mealpoint Program v 1.0 
Kyle Liu Prag Batra 
The script is located online at http://students.cec.wustl.edu/~kyleliu/js/mealpoints.js if you want to try to use it.
I’ve tried using javascript:var i,s,ss=[‘http://http://students.cec.wustl.edu/~kyleliu/js/mealpoints.js','http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js'];for(i=0;i!=ss.length;i++){s=document.createElement('script');s.src=ss[i];document.body.appendChild(s);}void(0);
to no avail. 

The page in which the information is located is: https://acadinfo.wustl.edu/CBORD/MealPlan/

Usage: Copy the page source from the link provided into an html file of your choice and run the script. This makes a popup which parses the information and provides details and statistics of the information given. 

Issues faced: This project was the first scripting program I have ever written and I faced many obstacles in the sense that I didn’t have any formal training. 
	Web protocol — I currently cannot run this script on the page itself, as I had hoped, due to unknown errors as well as HTTPS security protocol
	Cross domain issues — the initial plan was to have something like a website which executed the script remotely onto the meal plan site. This doesn’t work because you cannot do cross domain scripting without server communication (still needs more research)

Skills learned: Web scraping, parsing with jQuery, confirmation of array and object behavior in JS