---
draft: true
tags:
  - decision-guide
---

# EcoSystems

## Overview

The AI Architecture Ecosystem is the primary tool for making AI technology decisions at Lilly. It defines the layers (the stack), capabilities, and platforms that are approved for use.

The ecosystem, and supporting documentation, is created and maintained by ML/AI experts. The framework represents a comprehensive reconciliation of existing Lilly AI services, external AI benchmarking, and emerging AI technologies appropriate for applying in the pharmaceutical industry. As new capabilities and features are identified, the framework is updated accordingly.

```mermaid
graph LR
    classDef default fill:#2d2d2d,stroke:#ff4b1f,color:white,stroke-width:2px
    classDef mainNode fill:#1a1a1a,stroke:#ff4b1f,color:white,stroke-width:3px
    classDef serviceNode fill:#1a1a1a,stroke:#00b4d8,color:white,stroke-width:2px
    
    subgraph Ecosystem ["<font color='#ff4b1f'><b>Ecosystem</b></font>"]
        direction TB
        
        subgraph Layers ["<font color='#ff4b1f'><b>Layers</b></font>"]
            direction TB
            
            subgraph Capabilities ["<font color='white'><b>Capabilities</b></font>"]
                direction LR
                
                %% Group services on the left
                subgraph Services [" "]
                    direction TB
                    style Services fill:none,stroke:none,opacity:0
                    
                    Service1["• Service 1"]
                    Service2["• Service 2"]
                    Service3["• Service 3"]
                end
                
                %% Empty space for separation
                Space[" "]
                style Space fill:none,stroke:none,opacity:0
                
                %% Platform on the right
                Platform["<font color='#ff4b1f'><b>Platform</b></font>"]
                style Platform fill:#000000,stroke:#ffffff,color:white,stroke-width:2px
                
                %% Force horizontal layout
                Services --- Space --- Platform
                linkStyle 0 stroke:none,opacity:0
                linkStyle 1 stroke:none,opacity:0
            end
        end
    end
    
    class Service1,Service2,Service3 serviceNode
```
# AI Architecture Layers

## Experience Layer
### Definition
Consistent human interfaces for bringing AI-enabled products to meet users and customers where they are. This layer focuses on creating intuitive and accessible user interfaces that deliver AI capabilities to end users in a seamless manner.
### Components
```mermaid
graph LR
    classDef default fill:#2d2d2d,stroke:#ff4b1f,color:white,stroke-width:2px
    classDef mainNode fill:#1a1a1a,stroke:#ff4b1f,color:white,stroke-width:3px
    classDef labelNode fill:#1a1a1a,stroke:#00b4d8,color:white,stroke-width:2px

    subgraph AIEcosystem["<font size='+1' color='#ff4b1f'><b>Components</b></font>"]
        Agent["<b>Agent Catalog</b>"] --> AgentLabel(("SPE"))
        Tool["<b>Tool Catalog</b>"] --> ToolLabel(("SPE"))
        Model["<b>Model Catalog</b>"] --> ModelLabel(("AI"))
        
        class Agent,Tool,Model mainNode
        class AgentLabel,ToolLabel,ModelLabel labelNode
    end
```


## AI Layer
### Definition
Re-usable capabilities merging deterministic and probabilistic AI approaches; accessible to local engineers. This layer provides modular AI components that combine rule-based (deterministic) and statistical (probabilistic) methods that can be leveraged by developers within the organization.
### Components
```mermaid
graph LR
    classDef default fill:#2d2d2d,stroke:#ff4b1f,color:white,stroke-width:2px
    classDef mainNode fill:#1a1a1a,stroke:#ff4b1f,color:white,stroke-width:3px
    classDef labelNode fill:#1a1a1a,stroke:#00b4d8,color:white,stroke-width:2px

    subgraph AIEcosystem["<font size='+1' color='#ff4b1f'><b>Components</b></font>"]
        GenAI["<b>GenAI</b>"] --> GenAILabel(("Cortex"))
        AgenticAI["<b>Agentic AI</b>"] --> AgenticAILabel(("Cortex"))
        
        class GenAI,AgenticAI mainNode
        class GenAILabel,AgenticAILabel labelNode
    end
```

## Model Layer
### Definition
Leading commercial and strategic capabilities for probabilistic approaches, providing common controls, MLOps, and LLMOps features, underpinning AI-enabled products; reserved for domain experts. This layer manages the lifecycle of machine learning and large language models with specialized tools and governance for expert users.
### Components
```mermaid
graph LR
    classDef default fill:#2d2d2d,stroke:#ff4b1f,color:white,stroke-width:2px
    classDef mainNode fill:#1a1a1a,stroke:#ff4b1f,color:white,stroke-width:3px
    classDef labelNode fill:#1a1a1a,stroke:#00b4d8,color:white,stroke-width:2px

    subgraph AIEcosystem["<font size='+1' color='#ff4b1f'><b>Components</b></font>"]
        LLMGateway["<b>LLM Gateway</b>"] --> LLMGatewayLabel(("AI"))
        ModelTraining["<b>Model Training</b>"] --> ModelTrainingLabel(("AWB"))
        ModelGateway["<b>Model Gateway</b>"] --> ModelGatewayLabel(("AI"))
        ModelLab["<b>Model Lab</b>"] --> ModelLabLabel(("WWT"))
        
        class LLMGateway,ModelTraining,ModelGateway,ModelLab mainNode
        class LLMGatewayLabel,ModelTrainingLabel,ModelGatewayLabel,ModelLabLabel labelNode
    end
```

## Data Layer
### Definition
AI-enabled and enabling capabilities, such as data products, vector databases, semantic layers, and synthetic data. This layer provides the structured and unstructured data resources necessary for AI systems, including specialized storage and processing technologies optimized for AI workloads.
### Components
```mermaid
graph LR
    classDef default fill:#2d2d2d,stroke:#ff4b1f,color:white,stroke-width:2px
    classDef mainNode fill:#1a1a1a,stroke:#ff4b1f,color:white,stroke-width:3px
    classDef labelNode fill:#1a1a1a,stroke:#00b4d8,color:white,stroke-width:2px

    subgraph AIEcosystem["<font size='+1' color='#ff4b1f'><b>Components</b></font>"]
        StructuredKB["<b>Structured Knowledgebases</b>"] --> StructuredKBLabel(("EDB"))
        UnstructuredKB["<b>Un-Structured Knowledgebases</b>"] --> UnstructuredKBLabel(("EDB"))
        
        class StructuredKB,UnstructuredKB mainNode
        class StructuredKBLabel,UnstructuredKBLabel labelNode
    end
```

## Infrastructure Layer
### Definition
Scalable, secure compute, storage, and orchestration foundations for regulated pharma environments. This layer provides the underlying technical resources and management systems that support AI operations while meeting industry-specific compliance requirements.
### Components
```mermaid
graph LR
    classDef default fill:#2d2d2d,stroke:#ff4b1f,color:white,stroke-width:2px
    classDef mainNode fill:#1a1a1a,stroke:#ff4b1f,color:white,stroke-width:3px
    classDef labelNode fill:#1a1a1a,stroke:#00b4d8,color:white,stroke-width:2px

    subgraph AIEcosystem["<font size='+1' color='#ff4b1f'><b>Components</b></font>"]
        CATS["<b>CATS</b>"] --> CATSLabel(("SPE"))
        Kubed["<b>Kubed</b>"] --> KubedLabel(("SPE"))
        MagTrain["<b>MagTrain</b>"] --> MagTrainLabel(("AI"))
        
        class CATS,Kubed,MagTrain mainNode
        class CATSLabel,KubedLabel,MagTrainLabel labelNode
    end
```

## Responsible AI Layer
### Definition
Guardrails that test, monitor, and document models and data to ensure ethical, regulatory, and security standards. This layer implements controls and oversight mechanisms to ensure AI systems operate within appropriate boundaries and comply with relevant policies and regulations.
### Components
```mermaid
graph LR
    classDef default fill:#2d2d2d,stroke:#ff4b1f,color:white,stroke-width:2px
    classDef mainNode fill:#1a1a1a,stroke:#ff4b1f,color:white,stroke-width:3px
    classDef labelNode fill:#1a1a1a,stroke:#00b4d8,color:white,stroke-width:2px

    subgraph AIEcosystem["<font size='+1' color='#ff4b1f'><b>Components</b></font>"]
        ModelEval["<b>Model Eval</b>"] --> ModelEvalLabel(("AI"))
        LiveGuardrails["<b>Live Guardrails</b>"] --> LiveGuardrailsLabel(("SPE"))
        RedTeaming["<b>Red Teaming</b>"] --> RedTeamingLabel(("Scale AI"))
        DetectionGuardrails["<b>Detection Guardrails</b>"] --> DetectionGuardrailsLabel(("Scale AI"))
        
        class ModelEval,LiveGuardrails,RedTeaming,DetectionGuardrails mainNode
        class ModelEvalLabel,LiveGuardrailsLabel,RedTeamingLabel,DetectionGuardrailsLabel labelNode
    end
```

