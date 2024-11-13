SELECT Case.CaseNumber,FIELDS(ALL) FROM CaseMilestone WHERE CaseId IN (SELECT Id FROM Case WHERE (OwnerId = '0053f0000018Y5gAAE' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled')  OR Id='5006S00001swFiAQAU') AND IsCompleted = false LIMIT 200

SELECT Case.CaseNumber, FIELDS(ALL) FROM CaseMilestone WHERE CaseId IN (SELECT Id FROM Case WHERE OwnerId = '00G3f000000N38GEAS' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' and ID='5006S00001sv9L4QAI') AND IsCompleted = false LIMIT 200

SELECT Case.CaseNumber, FIELDS(ALL) FROM CaseMilestone WHERE CaseId IN (SELECT Id FROM Case WHERE (OwnerId = '${useriD}' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled') ${filter} ) AND IsCompleted = false LIMIT 200;

SELECT Case_Number__c,Case__c,Comment_to_Search__c,CreatedDate FROM Case_Comment__c WHERE Case__c = '5006S00001rylzJQAQ' AND Comment_Action_Type__c != 'Customer Action' AND Inbound__c = true ORDER BY CreatedDate DESC NULLS FIRST LIMIT 1

SELECT Case_Number__c,Case__c,Comment_to_Search__c, CreatedDate FROM Case_Comment__c where Case__c IN (SELECT Id FROM Case WHERE (OwnerId = '0053f0000018Y5gAAE' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' AND Next_Action__c = 'Case Owner')) 

SELECT Max(Comment_to_Search__c) Note, Max(CreatedDate) CrDt, Max(Case__c) Id  FROM Case_Comment__c where Case__c IN (SELECT Id FROM Case WHERE (OwnerId = '0053f0000018Y5gAAE' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' AND Next_Action__c = 'Case Owner')) GROUP BY Case_Number__c


SELECT Max(Comment_to_Search__c) Note, Max(CreatedDate) CrDt, Max(Case_Number__c) Id  FROM Case_Comment__c where Case__c IN (SELECT Id FROM Case WHERE (OwnerId = '0053f0000018Y5gAAE' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' AND Next_Action__c = 'Case Owner')) AND Comment_Action_Type__c != 'Customer Action' AND Inbound__c = true GROUP BY Case__c 

SELECT Case_Number__c,Case__c,Comment_to_Search__c,CreatedDate FROM Case_Comment__c WHERE Case__c IN (SELECT Id FROM Case WHERE (OwnerId = '0053f0000018YJrAAM' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' AND Next_Action__c = 'Case Owner')) AND Comment_Action_Type__c != 'Customer Action' AND Inbound__c = true ORDER BY CreatedDate DESC NULLS FIRST LIMIT 1

Select Case__c, Max(CreatedDate) from (SELECT Case_Number__c,Case__c,Comment_to_Search__c,CreatedDate FROM Case_Comment__c WHERE Case__c IN (SELECT Id FROM Case WHERE (OwnerId = '0053f0000018Y5gAAE' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' AND Next_Action__c = 'Case Owner')) AND Comment_Action_Type__c != 'Customer Action' AND Inbound__c = true ORDER BY CreatedDate DESC)

SELECT Case_Number__c,Case__c,Comment_to_Search__c,CreatedDate FROM Case_Comment__c WHERE CreatedDate > 2022-05-21T18:46:16.390Z AND Case__c IN (SELECT Case__c FROM Case_Team__c WHERE OwnerId = '0053f0000018Y5gAAE' AND Role__c = 'CoOwner' AND Case__r.status !='closed' AND Case__r.status != 'Delivered' AND Case__r.status != 'Cancelled') AND Comment_Action_Type__c != 'Customer Action' AND Inbound__c = true ORDER BY CreatedDate DESC
SELECT Description,Error_Message__c,Subject FROM Case WHERE CaseNumber = '04316908'

SELECT Id,Name FROM Group WHERE Name LIKE '%GCS%'

SELECT Body,IsRichText,ParentId,Type FROM CaseFeed WHERE ParentId = '5006S00001vHU2dQAG' AND Visibility = 'InternalUsers'

SELECT Case__c FROM Case_Team__c WHERE Role__c = 'CoOwner' AND OwnerId = '0053f0000018Y5gAAE'

SELECT Case__c FROM Case_Team__c WHERE OwnerId = '0053f0000018Y5gAAE' AND Role__c = 'CoOwner' AND Case__r.status !='closed' AND Case__r.status != 'Delivered' AND Case__r.status != 'Cancelled'

SELECT Id, owner.email, LastModifiedBy.Manager.Email FROM case where Id='5006S00002EQs4SQAT'