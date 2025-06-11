---
tags:
  - decision-guide
  - translation
---

# Translation

:::info Guide Status

- Lifecycle: Living Document
- Last Update: 2025-04-28
- Capability Owner: Ryan W Miller
- EBA Lead: Chris Blessing
- Contributors & Reviewers: Ryan W Miller, Rafael Garcia, Neal Chen, Emily Bartman

:::

A decision guide for common language translations use cases, using services that can handle all Lilly information
classifications.

To plan for upcoming Lilly Translation features, please see the
[Lilly Translate roadmap](https://collab.lilly.com/:f:/r/sites/EnterpriseData2/Shared%20Documents/Ent%20Data%20Roadmaps).

Discover announcements and ask questions at
<ExternalLink>[Lilly Translate on Viva Engage](https://engage.cloud.microsoft/main/groups/eyJfdHlwZSI6Ikdyb3VwIiwiaWQiOiIxNDg4NzQ1MTAzMzYifQ/all)</ExternalLink>,
our Tech@Lilly community for machine translation, speech, and language needs.

| Use Case/Scenario                                                                                                             | Tech Recommendation                                                            | Positioning        | Complexity | Notable Integration/Interop                                      | Owning Org/Team       | Next Step                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------ | ---------- | ---------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| **Ad hoc plain text translation**                                                                                             | **[Lilly Translate (UI)](https://language.lilly.com/translate)**               | **Strategic Core** | Low        |                                                                  | Enterprise Data       | [Use](https://language.lilly.com/translate)                                                 |
| **Ad hoc document-to-document translation**                                                                                   | **[Lilly Translate (UI)](https://language.lilly.com/translate)**               | **Strategic Core** | Low        | Word, Excel, PowerPoint, PDF, TXT, CSV, Markdown, HTML, or XLIFF | Enterprise Data       | [Use](https://language.lilly.com/translate)                                                 |
| **Programmatic translation**                                                                                                  | **[Lilly Translate (API)](https://language.lilly.com/Guide)[^1]**              | **Strategic Core** | Low        | APIs, includes document support                                  | Enterprise Data       | [Request API access](https://language.lilly.com/)<br /> _(see Lilly Translate page footer)_ |
| Translation using custom dictionaries/terminology                                                                             | [Lilly Translate (UI & API)](https://language.lilly.com/Guide)[^1]             | Standard           | Low        | APIs                                                             | Enterprise Data       | [Engage with Enterprise Data](mailto:LillyTranslate@lilly.com)                              |
| Translation model trained on custom user/domain data                                                                          | [Lilly Translate (UI & API)](https://language.lilly.com/Guide)[^1]             | Standard           | Low        | APIs                                                             | Enterprise Data       | [Engage with Enterprise Data](mailto:LillyTranslate@lilly.com)                              |
| Prioritizing natural-sounding translation, with public domain knowledge                                                       | LLMs, such as [Azure OpenAI](https://cloud.lilly.com/lcs/)                     | Emerging           | Medium     | APIs                                                             | AI                    | [Register AI Idea](https://ai.lilly.com/)                                                   |
| [Post-editing UI for model refinement](https://www.transperfect.com/blog/improving-machine-translation-post-editing-workflow) | [TransPerfect GlobalLink](https://globallink.transperfect.com/)                | Specialized        | Medium     |                                                                  | Enterprise Data & LRL | Contact [Lilly Translate for onboarding](mailto:LillyTranslate@lilly.com)                   |
| [Translation workflow management](https://globallink.transperfect.com/solutions/translation-workflow-management)              | [TransPerfect GlobalLink](https://globallink.transperfect.com/)                | Specialized        | Medium     |                                                                  | Enterprise Data & LRL | Contact [Lilly Translate for onboarding](mailto:LillyTranslate@lilly.com)                   |
| [Certified translations](https://www.atanet.org/client-assistance/what-is-a-certified-translation/)                           | Various, including [TransPerfect](https://globallink.transperfect.com/) option | Specialized        | Medium     |                                                                  | Various               | Contact your Area Architect & Procurement                                                   |
| [Direct Veeva integration](https://www.transperfect.com/content-connector)                                                    | [TransPerfect GlobalLink](https://globallink.transperfect.com/)                | Specialized        | High       | Veeva                                                            | Enterprise Data & LRL | Contact [Lilly Translate for onboarding](mailto:LillyTranslate@lilly.com)                   |

## Performance of LLMs and NMT

Both Large Language Models (LLMs) and neural machine translation (NMT) have strengths and are available at Lilly in
various tools above. It is hard to quantify performance in a way that applies to a wide variety of use cases. Metrics
for performance do exist, such as
[BLEU scores](https://learn.microsoft.com/en-us/azure/ai-services/translator/custom-translator/concepts/bleu-score), but
care must be taken to understand the context of the measure. Microsoft has a useful article on AI and LLMs for
translation, and compares the _general_ strengths and weaknesses of the 2.\
[Using artificial intelligence and large language models for translation on Microsoft.com](https://learn.microsoft.com/en-us/globalization/localization/ai/ai-and-llms-for-translation)

[^1]:
    See the guide in Lilly Translate's left sidebar on training custom models, using dictionaries, and API integrations
