---
hide_table_of_contents: true
tags:
  - decision-guide
  - visualization
---

# Viz Tools

:::info Guide Status

- Lifecycle: Draft
- Last Update: 2025-04-28
- Capability Owner: Ryan W Miller
- EBA Lead: Chris Blessing
- Contributors & Reviewers: TBD

:::

This is a decision guide for Visualization Tools. Visualization tools are powerful software applications that transform
complex data into easy-to-understand visuals, allowing businesses to track relevant key metrics from one centralized,
intuitive interface.

This guide is focused on recommending the _best_ tool for each scenario. The features of the most common tech tools
overlap, but we are providing recommendations for best practices at Lilly. These scenarios are targeted at business
analyst type users, looking for a UI-based option to create visuals. Additional tech recommendations for code based
visuals (D3, Plotly, etc.) at Lilly will exist in a separate decision guide.

| Use Case/Scenario                                    | Complexity[^1] | Tech Recommendation[^2]                                                                                          | Integrations & Interop                                                                                                                                | Owning Org/Team | Next Step                                                                                                                                                                              |
| ---------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Quick report or visual creation                      | 0              | Power BI                                                                                                         | S3, Databases, APIs                                                                                                                                   | Enterprise Data | Use, or request license if needed                                                                                                                                                      |
| Creating dashboards with Copilot or Q&A features     | 1              | Power BI                                                                                                         | S3, Databases, APIs                                                                                                                                   | Enterprise Data | [Request PBI Copilot Access](https://collab.lilly.com/sites/EIP_Analytics_PowerBI/SitePages/PowerBI-Copilot.aspx)                                                                      |
| Collaboration, sharing, and embedding in Office apps | 1              | Power BI                                                                                                         | O365, SharePoint (both as source and publish)                                                                                                         | Enterprise Data | Use, or request license if needed                                                                                                                                                      |
| Dashboards based on S3 Files[^3]                     | 1              | QuickSight                                                                                                       | S3, AWS Databases, APIs                                                                                                                               | Enterprise Data | [Request Access](https://data.lilly.com/analyze-data)                                                                                                                                  |
| Executive Overview                                   | 1              | [Power BI Narrative Visuals](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-create-narrative) | S3, Databases, APIs                                                                                                                                   | Enterprise Data | [Request PBI Copilot Access](https://collab.lilly.com/sites/EIP_Analytics_PowerBI/SitePages/PowerBI-Copilot.aspx)                                                                      |
| Paginated reporting                                  | 2              | Power BI                                                                                                         | S3, Databases, APIs                                                                                                                                   | Enterprise Data | Use, or request license if needed                                                                                                                                                      |
| Complex data prep computations for visuals           | 2              | Power BI                                                                                                         | S3, Databases, APIs                                                                                                                                   | Enterprise Data | Use, or request license if needed                                                                                                                                                      |
| Creating dashboards primarily for mobile devices     | 2-3            | Tableau                                                                                                          | Databases, APIs                                                                                                                                       | Enterprise Data | [Request License](https://collab.lilly.com/sites/TableauService/SitePages/Request-Links.aspx)                                                                                          |
| Visualizing chemical structures                      | 2              | Spotfire                                                                                                         | [Databases, and various third party connectors](https://collab.lilly.com/:p:/r/sites/Spotfireteamsite/Public%20Library/Spotfire%20Data%20source.pptx) | Enterprise Data | [Request Access](https://collab.lilly.com/sites/Spotfireteamsite/SitePages/Home.aspx)                                                                                                  |
| Real-time Data Monitoring                            | 3              | [Power BI w/ Eventhouse](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/eventhouse)             | S3, Databases, APIs                                                                                                                                   | Enterprise Data | Use, or request license if needed                                                                                                                                                      |
| Integrating custom ML models with dashboards         | 4              | [QuickSight + SageMaker AI](https://docs.aws.amazon.com/quicksight/latest/user/sagemaker-integration.html)       | S3, Databases, APIs                                                                                                                                   | Enterprise Data | [Use AWB and review documentation](https://collab.lilly.com/sites/AWSQuickSightServiceSite/SitePages/SageMaker-Machine-Learning-Prediction-in-QuickSight-Dashboard.aspx)               |
| Sharing dashboards with external parties             | 4              | Power BI                                                                                                         | S3, Databases, APIs                                                                                                                                   | Enterprise Data | [Review documentation and submit TPET](https://collab.lilly.com/:b:/r/sites/EIP_Analytics_PowerBI/Getting%20Started%20Library/General/External%20Users%20access%20to%20Power%20BI.pdf) |

## Power BI (PBI)

Power BI is a commonly used tool at Lilly that integrates well with O365. Many users at Lilly have the access / license
they need by default as part of their standard Lilly account. Those needing to request access or a license can do so on
[data.lilly.com](https://data.lilly.com/analyze-data)

Cost: $

[Power BI Service Site](https://collab.lilly.com/sites/EIP_Analytics_PowerBI/SitePages/PowerBI-Fabric1.aspx)

## QuickSight

QuickSight is AWS's offering for creating dashboards and visuals. It does not offer as many features as more mature tool
like PowerBI, but it has strong integrations with other AWS services.

Cost: $

[QuickSight Service Site](https://collab.lilly.com/sites/AWSQuickSightServiceSite)

## Tableau

At the time of this writing, Tableau at Lilly lacks several of the AI related features offered in other tech options.
Due to that, Power BI is recommended over Tableau in cases where both tech options meet the use case need.

Cost: $$$

[Tableau Service Site](https://collab.lilly.com/sites/TableauService)

## Spotfire

Spotfire is a specialized tool, suggested specifically for visualization needs related to chemical structures.

Cost: $$

[Spotfire Service Site](https://collab.lilly.com/sites/Spotfireteamsite/SitePages/Home.aspx)

### Footnotes

[^1]: (0) Ready-to-use, (1) Configurable, (2) Customizable, (3) Requires integration, (4) High-complexity

[^2]: Only the most significant integrations & interoperability are listed.

[^3]: Other tools can use S3, but QuickSight offers the simplest integration.
