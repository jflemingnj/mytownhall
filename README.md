# mytownhall
Code supporting the My Town Hall Amazon Alexa Skill

My Town Hall - Coding For Community
By: Troop 58 - Oceanport

Code represents a solution supporting an Amazon Alexa Skill which answers common questions community residents have about their town.  The solution is composed of four main component types, for which the source code is provided in the folders referenced below.

- admin folder
Contains the user interfaces facilitating the management of answer data for common questions.  The interfaces leverage the open source framework editablegrid (http://www.editablegrid.net) to render the table and form fields.  Dependent js/css files are hosted from an external site and interactions are AJAX based, so the files can be run in any client environment in which there is internet access.

- alexa folder
Contains the intents JSON (intents.txt) and sample utterances (utterances.txt) configured for the My Town Hall Alexa service.

- database folder
Contains the SQL scripts supporting the creation of dependent tables and views.

- lambda folder
Contains the Javascript code representing the AWS Lambda functions used by the Alexa skill and the administrative interfaces.
