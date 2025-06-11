---
hide_table_of_contents: false
tags:
  - resiliency
  - decision-guide
---

# Resiliency

:::info Guide Status

- Lifecycle: Draft
- Last Update: 2025-03-28
- Capability Owner: Smita Carneiro
- EBA Lead: Todd Walters
- Contributors & Reviewers: Karl Mayer

:::

This guide outlines our approach to system resiliency, the ability to withstand disruptions, recover from failures, and
maintain continuous operations. This encompasses disaster recovery (DR) capabilities, high availability (HA)
architecture, and business continuity planning. Proper resiliency ensures that critical business functions continue
operating during hardware failures, software issues, network outages, or even catastrophic events. This document
provides guidance on determining your application's resiliency requirements based on business criticality and
implementing appropriate architectural patterns to achieve the required level of service availability.

## Resiliency Design Steps

1. **Assess Application Criticality**: Begin by identifying the Business Application CI ID in ServiceNow. Detailed
   instructions can be found in the
   [Determine Application Criticality document](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FGeneral%2FDetermine%20application%20criticality%2Epdf&viewid=4ec559ad-b5cd-4bf5-bb66-5474fea47b81&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FGeneral).
   This step is crucial for understanding the criticality of your application within its business context.

2. **Define Resiliency Requirements**: Next, use the
   [Resiliency Tier / Infrastructure Matrix](#resiliency-tier--infrastructure-matrix) below to determine the system's
   resiliency requirements. This will help you identify the necessary measures to ensure your application's availability
   and reliability. You can also refer to the
   [Resiliency Requirements document](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FResiliency%20requirements%2FResiliencyRequirements%2Epdf&viewid=4ec559ad%2Db5cd%2D4bf5%2Dbb66%2D5474fea47b81&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FResiliency%20requirements)
   for additional detail for your application's tier.

3. **Implement Resilient Architecture**: Based on your application's tier, follow the guidelines in the
   [Resiliency Patterns document](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FPatterns%20for%20resiliency%2FResiliencyPatterns%2Epdf&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FPatterns%20for%20resiliency).
   This resource provides comprehensive information on building high resiliency for various infrastructure components
   like VMs, databases, and containers. It also explains different disaster recovery (DR) models, helping you design a
   robust and fault-tolerant system.

## Critical Systems Governance

Tier 0, Critical Systems and Local HA Manufacturing must follow the governance processes for Critical Systems,
[documented here](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FGeneral%2FResiliency%40Lilly%5FAssessmentDetails%2Epdf&viewid=4ec559ad%2Db5cd%2D4bf5%2Dbb66%2D5474fea47b81&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FGeneral).

## Resiliency Tier / Infrastructure Matrix

| Tier                   | Cloud                                     | On-Prem                                           |
| ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Tier 0-A               | [Tier 0-A](#tier-0-a)                     | same as cloud                                     |
| Tier 0-B               | [Tier 0-B](#tier-0-b)                     | same as cloud                                     |
| Critical High          | [Critical High](#critical-high-cloud)     | [Critical High](#critical-high-on-prem)           |
| Critical Medium        | [Critical Medium](#critical-medium-cloud) | [Critical Medium](#critical-medium-on-prem)       |
| Critical Low           | [Critical Low](#critical-low-cloud)       | [Critical Low](#critical-low-on-prem)             |
| Local HA Manufacturing | N/A                                       | [Local HA Manufacturing](#local-ha-manufacturing) |
| All Other Systems      | [All Other Systems](#all-other-systems)   | same as cloud                                     |

If you have a system where you only want a subset of critical recovered after a disaster, rather than the entire app
refer to [this section](#critical-data) .

## Tier 0-A

This tier includes critical applications like authentication and networking. An Active-Active DR model is ideal.

- **DR RTO**: < 1 hour
- **DR RPO**: < 15 minutes
- **High Availability RTO**: < 1 hour
- **High Availability RPO**: < 15 minutes
- **Backups**: One copy locally, one in a secondary region
- **Monitoring**: Implement monitoring and alerting
- **DR Testing**: Annual tests to ensure recovery within RTO and RPO
- **HA Testing**: Test before production. For Active-Active, DR tests also serve as HA tests
- **DR Assessments**: Periodic assessments for compliance

## Tier 0-B

This tier includes applications essential for recovering other applications after a disaster, such as backup systems.
These have high resiliency requirements, though less stringent than Tier 0-A. If Active-Active is not feasible for DR,
consider Warm-Active or Pilot Light models.

- **DR RTO**: < 4 hours
- **DR RPO**: < 15 minutes
- **High Availability RTO**: < 2 hours
- **High Availability RPO**: < 15 minutes
- **Backups**: One copy locally, one in a secondary region
- **Monitoring**: Implement monitoring and alerting
- **DR Testing**: Annual tests to ensure recovery within RTO and RPO
- **HA Testing**: Test before production. For Active-Active, DR tests also serve as HA tests
- **DR Assessments**: Periodic assessments for compliance

## Critical High Cloud

This tier includes applications hosted in native Azure or AWS (not AVS) that, if unavailable for more than 8 hours,
would negatively impact the enterprise. Pilot Light models are sufficient for these applications.

- **DR RTO**: < 8 hours
- **DR RPO**: < 1 hour
- **High Availability RTO**: < 4.5 hours
- **High Availability RPO**: < 15 minutes
- **Backups**: One copy locally, one in a secondary region
- **Monitoring**: Implement monitoring and alerting
- **DR Testing**: Annual tests to ensure recovery within RTO and RPO
- **HA Testing**: Test before production. For Active-Active, DR tests also serve as HA tests
- **DR Assessments**: Periodic assessments for compliance

## Critical High On-Prem

This tier includes applications hosted on-prem or in AVS that, if unavailable for more than 8 hours, would negatively
impact the enterprise. Pilot Light models are sufficient. The DR team offers a managed solution for this. To onboard
systems, check out this
[link](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FDocumentation%20on%20onboarding%20apps%20to%20Azure%20DR%2FAzure%20Cloud%20DR%20WI%2Epdf&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FDocumentation%20on%20onboarding%20apps%20to%20Azure%20DR).
Note that there is a
[charge](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FFinOps%2FAzureDRFundingModelv1%2Epdf&viewid=4ec559ad%2Db5cd%2D4bf5%2Dbb66%2D5474fea47b81&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FFinOps)
for this.

- **DR RTO**: < 8 hours
- **DR RPO**: < 1 hour
- **Backups**: One copy locally, one in a secondary region
- **Monitoring**: Implement monitoring and alerting
- **DR Testing**: Annual tests to ensure recovery within RTO and RPO
- **DR Assessments**: Periodic assessments for compliance

## Critical Medium Cloud

This tier includes applications hosted in native Azure or AWS (not AVS) that, if unavailable for more than 24 hours,
would negatively impact the enterprise. Pilot Light models are sufficient for these applications.

- **DR RTO**: < 24 hours
- **DR RPO**: < 1 hour
- **High Availability RTO**: < 8 hours
- **High Availability RPO**: < 15 minutes
- **Backups**: One copy locally, one in a secondary region
- **Monitoring**: Implement monitoring and alerting
- **DR Testing**: Annual tests to ensure recovery within RTO and RPO
- **HA Testing**: Test before production. For Active-Active, DR tests also serve as HA tests
- **DR Assessments**: Periodic assessments for compliance

## Critical Medium On-Prem

This tier includes applications hosted on-prem or in AVS that, if unavailable for more than 24 hours, would negatively
impact the enterprise. Pilot Light models are sufficient. The DR team offers a managed solution for this. To onboard
systems, check out this
[link](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FDocumentation%20on%20onboarding%20apps%20to%20Azure%20DR%2FAzure%20Cloud%20DR%20WI%2Epdf&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FDocumentation%20on%20onboarding%20apps%20to%20Azure%20DR).
Note that there is a
[charge](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FFinOps%2FAzureDRFundingModelv1%2Epdf&viewid=4ec559ad%2Db5cd%2D4bf5%2Dbb66%2D5474fea47b81&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FFinOps)
for this.

- **DR RTO**: < 24 hours
- **DR RPO**: < 1 hour
- **Backups**: One copy locally, one in a secondary region
- **Monitoring**: Implement monitoring and alerting
- **DR Testing**: Annual tests to ensure recovery within RTO and RPO
- **DR Assessments**: Periodic assessments for compliance

## Critical Low Cloud

This tier includes applications hosted in native Azure or AWS (not AVS) that, if unavailable for more than 72 hours,
would negatively impact the enterprise. Pilot Light models are sufficient for these applications.

- **DR RTO**: < 72 hours
- **DR RPO**: < 1 hour
- **High Availability RTO**: < 24 hours
- **High Availability RPO**: < 15 minutes
- **Backups**: One copy locally, one in a secondary region
- **Monitoring**: Implement monitoring and alerting
- **DR Testing**: Annual tests to ensure recovery within RTO and RPO
- **HA Testing**: Test before production. For Active-Active, DR tests also serve as HA tests
- **DR Assessments**: Periodic assessments for compliance

## Critical Low On-Prem

This tier includes applications hosted on-prem or in AVS that, if unavailable for more than 72 hours, would negatively
impact the enterprise. Pilot Light models are sufficient. The DR team offers a managed solution for this. To onboard
systems, check out this
[link](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FDocumentation%20on%20onboarding%20apps%20to%20Azure%20DR%2FAzure%20Cloud%20DR%20WI%2Epdf&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FDocumentation%20on%20onboarding%20apps%20to%20Azure%20DR).
Note that there is a
[charge](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FFinOps%2FAzureDRFundingModelv1%2Epdf&viewid=4ec559ad%2Db5cd%2D4bf5%2Dbb66%2D5474fea47b81&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FFinOps)
for this.

- **DR RTO**: < 72 hours
- **DR RPO**: < 1 hour
- **Backups**: One copy locally, one in a secondary region
- **Monitoring**: Implement monitoring and alerting
- **DR Testing**: Annual tests to ensure recovery within RTO and RPO
- **DR Assessments**: Periodic assessments for compliance

## Local HA Manufacturing

This tier includes applications hosted on-prem at a manufacturing site, excluding global manufacturing applications. If
a manufacturing site goes down, only the data at that site is recovered, not a full IT system recovery. Manufacturing
cannot afford downtime due to component failure, so high availability is essential, typically achieved with dual
computer rooms.

- **High Availability RTO**: < 2 hours
- **High Availability RPO**: < 0 minutes
- **Backups**: One copy locally, one in a secondary region
- **Monitoring**: Implement monitoring and alerting
- **DR Assessments**: Periodic assessments for compliance

## Critical Data

If you have a system that does not need to be brought up immediately after a disaster but contains data needed
immediately, refer to the section titled ‘_Saving data separately from applications_’ in
[Resiliency Patterns](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FPatterns%20for%20resiliency%2FResiliencyPatterns%2Epdf&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FPatterns%20for%20resiliency)

If you have a question, you can discuss it with your
[DR Steward](https://collab.lilly.com/sites/ResiliencyatLilly/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FGeneral%2FDR%5FStewards%2Epdf&viewid=4ec559ad%2Db5cd%2D4bf5%2Dbb66%2D5474fea47b81&parent=%2Fsites%2FResiliencyatLilly%2FShared%20Documents%2FGeneral)
or send an email to resiliency@lists.lilly.com.

## All Other Systems

All production systems not covered by the above categories fall into this one. In case of a disaster, these systems will
be recovered via backup. This is a best effort process and may take 3-4 months.

- **DR RPO**: < 24 hours
- **Backups**: One copy locally, one in a secondary region
