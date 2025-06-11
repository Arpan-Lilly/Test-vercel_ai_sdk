---
tags:
  - diagramming
  - decision-guide
---

# Diagramming

:::info Guide Status

- Lifecycle: Draft
- Last Update: 2025-03-28
- Capability Owner: Sanish Haridas
- EBA Lead: Kapil Kamat
- Contributors & Reviewers:

:::

This guide provides recommendations for diagramming tools and frameworks.

| Use Case/Scenario                                        | Tech Recommendation                                                                                               | Positioning        | Complexity | Notable Integration/Interop   | Owning Org/Team            | Next Step                                                                                                                                       |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------ | ---------- | ----------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Collaborative product and architecture diagrams**      | **Lucidchart**                                                                                                    | **Strategic Core** | Low        | Web-based                     | SPE EDAT                   | [Automated Lucidsuite license](https://dev.lilly.com/docs/platforms-and-tools/lucidsuite/)                                                      |
| **Quick visualizations and non-technical presentations** | **PowerPoint**                                                                                                    | **Strategic Core** | Low        |                               | Digital Core Collaboration | Use                                                                                                                                             |
| **App & web wireframing, collaborative whiteboarding**   | **[Figma](https://elilillyco.stackenterprise.co/articles/1504)**                                                  | **Strategic Core** | Low        | Web-based                     | Digital Office UX          | [Login using Lilly email](https://www.figma.com/)                                                                                               |
| Collaborative Whiteboarding                              | [Microsoft Whiteboard](https://www.microsoft.com/en-us/microsoft-365/microsoft-whiteboard/digital-whiteboard-app) | Standard           | Low        | Microsoft Teams, web, or iPad | Digital Core Collaboration | [Use](https://app.whiteboard.microsoft.com/)                                                                                                    |
| Detailed technical diagrams and network diagrams         | Microsoft Visio                                                                                                   | Declining          | Low        | Windows only                  | Digital Core Collaboration | [Order Visio or use Visio Viewer](https://lilly.service-now.com/ec?id=search&spa=1&q=visio&disableAllSuggestions=false&disableSpellCheck=false) |
| Markdown-based diagramming and charting                  | [C4 Model](https://c4model.com/)                                                                                  | Standard           | Low        |                               | Digital Core EBA           | Use                                                                                                                                             |
| Programmatic flowchart and diagram creation              | [Mermaid](https://mermaid.js.org/)                                                                                | Emerging           | Medium     |                               | Digital Core EBA           | Use                                                                                                                                             |

## Use Cases

### Quick visualizations and non-technical presentations

Focuses on visual communication of complex software architecture to stakeholders who may not have a technical
background. These visualizations help to simplify intricate concepts, making them more accessible and easier to
understand.

### Detailed technical diagrams and network diagrams

Technical and network diagrams are vital for technical teams, offering a detailed blueprint of software architecture.
They illustrate system components, data flows, and interactions, helping developers and IT professionals understand
complex interdependencies. Network diagrams show the physical and logical layout of network infrastructure, essential
for troubleshooting, performance optimization, and ensuring scalability and security.

### Collaborative projects and cloud architecture diagrams

Collaborative projects and cloud architecture diagrams are key in modern software development. They enable teams to work
together smoothly, regardless of location. These diagrams map out cloud infrastructure, showing how services integrate
and interact. They are vital for planning, deploying, and managing scalable, resilient, and secure cloud applications.
Collaboration allows for continuous feedback and improvement, resulting in more robust cloud solutions.

### Visualizing and communicating software architecture to technical teams

Visualizing and communicating software architecture to technical teams involves creating representations that capture
the system's complexity while ensuring clarity and comprehensibility. This process includes developing detailed
flowcharts, UML diagrams, and architectural blueprints that delineate modules, dependencies, and data flow. These visual
aids not only facilitate better understanding among team members but also serve as a reference during development,
troubleshooting, and scaling phases.

## Tech Recommendations

- **PowerPoint**: Use for quick visualizations, presentations to non-technical audiences, and adding diagrams to slides.
- **Microsoft Visio**: Use for detailed technical diagrams, network diagrams, and complex process flows.
- **Lucidchart**: Use for collaborative projects, cloud architecture diagrams, and integrating with web-based tools.
- **C4 Model**: Use for visualizing and communicating software architecture to technical teams.
- **Mermaid**: Use for creating diagrams and visualizations using text-based descriptions, ideal for technical
  documentation, integrating with Markdown, and embedding in web applications.
