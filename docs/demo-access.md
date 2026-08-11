# Acessos oficiais

## Gestão

`gestor@riscozero.demo`

## Gestão de Tráfego

`trafego@riscozero.demo`

Os dois perfis possuem visão completa das funcionalidades atualmente liberadas. A diferença entre
eles representa o foco operacional, sem bloqueios artificiais entre Dashboard, CRM, Tarefas e
Conteúdo do Site.

O Simulador de Leads é controlado pela configuração persistente **Modo Demonstração**. Quando o
recurso está desabilitado, ele não aparece na navegação e sua rota não permite iniciar ou executar
simulações. Os leads reais enviados pelo formulário público continuam funcionando normalmente.

Antes da operação em produção, mantenha o **Modo Demonstração** desabilitado.

- Staging, homologação e apresentação: `demo_mode_enabled = true`.
- Produção real: `demo_mode_enabled = false`.

As senhas não são documentadas no repositório.
