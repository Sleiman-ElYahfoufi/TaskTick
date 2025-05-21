<img src="./readme/title1.svg"/>

<br><br>

<!-- project overview -->
<img src="./readme/title2.svg"/>

## TaskTick: Smart Development Estimation Tool

TaskTick is an AI-powered task management system designed  for software developers. The platform uses artificial intelligence to decompose projects into granular tasks, provide accurate time estimates based on industry data, and adapt to individual developer workflows over time.


<br><br>

<!-- System Design -->
<img src="./readme/title3.svg"/>

### ER Diagram
<img src="https://i.ibb.co/ZRYCVG1r/Screenshot-2025-05-19-195445.png" />

### User Flow Diagram

<img src="readme/demo/userflow.png" />



<br><br>

### System Flow Diagram
<img src="readme/demo/tech_stack.png"/>

<br><br>

### Component Diagram



<img src="readme/demo/image.png" />

<br><br>

### Sequence Diagram

<img src="https://mermaid.ink/svg/pako:eNqdVV1P2zAU_SuWpU1MKoimKSl-QGqJYJ1gYxR4mPpiktvUo7Ez24EB4r_v5sPQhLRI60sd-5zre889tp9ppGKgjBr4k4OMIBQ80Tyd67kk-Pv0iYSwEBJIxrUVkci4tIY8CLskmVYZaJIpI6xQUsjEsXhklSbXBrSbWWOTE62kBRkTbt7GOxOtHpDwpYsx4dFdTXDDne9g7LdZJzycFMiQW37LDZCd88fZz7NO5I8M5HhaoOvR-GLqcGsSjHO7BIksXhTqFor6do-OXAmMnKlEvK66aUTUObNWHHJZaG6sY9QwJIQTRm74SsTcQkPGcLK7Hq9YKutsh2ik9W5XkylpoCPRIh4joTDZij9iYLO8VVzHHYpcaPUbIkvOueQJpBi-8sR4ulGdYw1FOTVzm0wueFdllTgzfg9kKtF3fNWO-IasesqczpgcueLmjpyCBN1oZYVsaFuDIC45ZkseG5CtXh0ruRA6bWzb2S5XfaVX_GGbWuWvNelKpECuNG6ydjbf9aUEVNgFntqihm3NaQTFqtKUy3iDPJcQKR1XlPVm_q8011lc6jyz3ObmQ2WaqV53nuwp2siIZGnNRoGcfdrALnVOwEbLd8imKqdgyVdh8IrEI7naJkxZwOfKtN2HwVncebCroA5zo2fiPLLiXlg0ELcWtDRbpXdBG3lsVP5GmBzvryfsVTsb9097NNEipszqHHo0BTRA8Umfi_U5xTsrhTllOIy5vpvTuXxBDl7bv5RKHU2rPFlStuArg1956Y_6CXud1Zgh6GOVS0tZf9_bL6NQ9kz_UuaNgr2hdzAaDv3A8w4Dr0cfKdv1gv6eHwSHvn8w8nF2MHjp0ady4_5e3x_4w8HQH3nB4XC_jxSIBbbzvHpKyxf15R_zVGpm" />

<br><br>
<!-- Project Highlights -->
<img src="./readme/title4.svg"/>

<br>

<div align="center">

<img src="readme/demo/highlights.png"/>

</div>




<br><br>

<!-- Demo -->
<img src="./readme/title5.svg"/>



### User Screens (Web)

|   Landing                         |
| ------------------------------------|
| ![Landing](./readme/demo/pages/landing.gif) | 

| Login                                 | Register                       |
| --------------------------------------- | ------------------------------------- |
| ![Landing](./readme/demo/pages/Login.png) | ![fsdaf](./readme/demo/pages/sign-up.png) |

| Onboarding                            | Dashboard                       |
| --------------------------------------- | ------------------------------------- |
| ![Landing](./readme/demo/pages/onboarding.png) | ![fsdaf](./readme/demo/pages/dashboard.png) |


| Projects                            | Add Project                       |
| --------------------------------------- | ------------------------------------- |
| ![Landing](./readme/demo/pages/projects.png) | ![fsdaf](./readme/demo/pages/addProject.gif) |

| Generated Task                            | Project Details                       |
| --------------------------------------- | ------------------------------------- |
| ![Landing](./readme/demo/pages/generatedTasks.gif) | ![fsdaf](./readme/demo/pages/projectDetails.gif) |

| Tasks                         |   Settings                         |   
| --------------------------------------- | --------------------------------------- |
| ![Landing](./readme/demo/pages/tasks.png) | ![Landing](./readme/demo/pages/settings.png) | 



### Admin Screen (Web)

|   Analytics                         |
| ------------------------------------|
| ![Landing](./readme/demo/pages/admin_analytics.png) | 
<br><br>

<!-- Development & Testing -->
<img src="./readme/title6.svg"/>


### Validation
 DTO validation with class-validator decorators ensuring data integrity
### Time Tracking Service
 Automatic session duration calculation with heartbeat monitoring
### Comprehensive Test Coverage
 Thorough testing suite with coverage for all service methods


<div align="center">
  <table>
    <tr>
      <td><strong>Validation</strong></td>
      <td><strong>Testing</strong></td>
    </tr>
    <tr>
      <td><img src="./readme/demo/validation.png" width="450"></td>
      <td><img src="./readme/demo/tests.png" width="450"></td>
    </tr>
  </table>
</div>

| Services                                |
| --------------------------------------- |
| ![Landing](./readme/demo/service.png)   |
<br><br>


<br><br>

<!-- Deployment -->
<img src="./readme/title7.svg"/>

### AI Prompt Templates
- System instructions for task generation with time estimates and priority-based due dates
### Langchain Integration
- Zod schema validation and OpenAI model initialization
### Prompt Injection Protection
- Detection system for suspicious input patterns to maintain AI system security

<div align="center">
  <table>
    <tr>
      <td><strong>Prompts</strong></td>
      <td><strong>Langchain</strong></td>
    </tr>
    <tr>
      <td><img src="./readme/demo/prompts2.png" width="450"></td>
      <td><img src="./readme/demo/langchain.png" width="450"></td>
    </tr>
  </table>
</div>

| Prompt Protection                     |
| ------------------------------------- |
| ![fsdaf](./readme/demo/prompt_protection.png)|

<br><br>


<!-- Deployment -->
<img src="./readme/title8.svg"/>

### Deployment Flow

 ![fsdaf](./readme/demo/Deployment_Flow.png)

### AWS Cloud Deployment:
TaskTick is deployed using AWS infrastructure with an EC2 instance running the NestJS backend and MySQL database. The frontend is served from S3 buckets for improved performance and reliability. The deployment leverages load balancing for traffic management and auto-scaling to handle demand fluctuations, while CloudWatch monitors system health and performance metrics.
| Login                                   |     Project Decomposition                        | 
| --------------------------------------- | ------------------------------------- | 
| ![Landing](./readme/demo/Login_API.png) | ![fsdaf](./readme/demo/Project_Decompostion_API.png) | 


|Get Time Trackings                        |
|------------------------------------- |
|![fsdaf](./readme/demo/TimeTracking_API.png) |
<br><br>
