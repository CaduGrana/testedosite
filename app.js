// ==========================================================================
// SEÇÃO 1: GERENCIAMENTO DE ESTADO GLOBAL
// Classe centralizada para armazenar e gerenciar todos os dados da aplicação
// ==========================================================================

class AppState {
    constructor() {
        this.currentPage = 'home';
        this.currentTheme = localStorage.getItem('tattoo-theme') || 'light';
        this.isLoggedIn = false;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        
        // Dados iniciais dos agendamentos
        this.agendamentos = [
            {
                id: 1,
                cliente: "João Silva",
                telefone: "(11) 99999-9999",
                email: "joao@email.com",
                data: "2025-06-10",
                horario: "14:00",
                servico: "Tatuagem Pequena",
                observacoes: "Primeira tatuagem",
                status: "confirmado",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                cliente: "Maria Santos",
                telefone: "(11) 88888-8888", 
                email: "maria@email.com",
                data: "2025-06-12",
                horario: "16:00",
                servico: "Tatuagem Grande",
                observacoes: "Continuação da tattoo do braço",
                status: "confirmado",
                createdAt: new Date().toISOString()
            }
        ];
        
        // Configurações do sistema
        this.horariosDisponiveis = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
        this.servicos = ["Tatuagem Pequena", "Tatuagem Média", "Tatuagem Grande", "Retoque", "Consulta"];
        this.login = { usuario: "admin", senha: "123456" };
        
        this.nextId = 3;
        this.filtros = {
            data: '',
            servico: ''
        };
    }
    
    // Métodos para gerenciar agendamentos
    addAgendamento(agendamento) {
        agendamento.id = this.nextId++;
        agendamento.status = 'confirmado';
        agendamento.createdAt = new Date().toISOString();
        this.agendamentos.push(agendamento);
        this.saveToStorage();
    }
    
    removeAgendamento(id) {
        this.agendamentos = this.agendamentos.filter(ag => ag.id !== id);
        this.saveToStorage();
    }
    
    getAgendamentosByDate(date) {
        return this.agendamentos.filter(ag => ag.data === date);
    }
    
    getAgendamentosFiltered() {
        let filtered = [...this.agendamentos];
        
        if (this.filtros.data) {
            filtered = filtered.filter(ag => ag.data === this.filtros.data);
        }
        
        if (this.filtros.servico) {
            filtered = filtered.filter(ag => ag.servico === this.filtros.servico);
        }
        
        return filtered.sort((a, b) => new Date(a.data + ' ' + a.horario) - new Date(b.data + ' ' + b.horario));
    }
    
    // Estatísticas para o dashboard
    getStats() {
        const hoje = new Date().toISOString().split('T')[0];
        const agendamentosHoje = this.agendamentos.filter(ag => ag.data === hoje);
        
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const agendamentosSemana = this.agendamentos.filter(ag => {
            const dataAg = new Date(ag.data);
            return dataAg >= startOfWeek && dataAg <= endOfWeek;
        });
        
        return {
            total: this.agendamentos.length,
            hoje: agendamentosHoje.length,
            semana: agendamentosSemana.length
        };
    }
    
    // Persistência de dados
    saveToStorage() {
        try {
            localStorage.setItem('tattoo-agendamentos', JSON.stringify(this.agendamentos));
        } catch (e) {
            console.warn('Não foi possível salvar no localStorage:', e);
        }
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('tattoo-agendamentos');
            if (saved) {
                this.agendamentos = JSON.parse(saved);
                this.nextId = Math.max(...this.agendamentos.map(ag => ag.id), 0) + 1;
            }
        } catch (e) {
            console.warn('Não foi possível carregar do localStorage:', e);
        }
    }
}

// Instância global do estado
const appState = new AppState();

// ==========================================================================
// SEÇÃO 2: GERENCIAMENTO DE TEMAS
// Controla alternância entre modo claro e escuro
// ==========================================================================

class ThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Carrega tema salvo ou detecta preferência do sistema
        const savedTheme = localStorage.getItem('tattoo-theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            appState.currentTheme = savedTheme;
        } else if (systemDark) {
            appState.currentTheme = 'dark';
        }
        
        this.applyTheme(appState.currentTheme);
        this.updateThemeIcon();
        
        // Escuta mudanças na preferência do sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('tattoo-theme')) {
                appState.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(appState.currentTheme);
                this.updateThemeIcon();
            }
        });
    }
    
    toggle() {
        appState.currentTheme = appState.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(appState.currentTheme);
        this.updateThemeIcon();
        localStorage.setItem('tattoo-theme', appState.currentTheme);
        
        // Feedback visual
        if (window.toastManager) {
            toastManager.show(`Tema ${appState.currentTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'success');
        }
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Atualiza meta theme-color para mobile
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = theme === 'dark' ? '#1A1A1A' : '#FEFEFE';
    }
    
    updateThemeIcon() {
        const icon = document.querySelector('.theme-toggle__icon');
        if (icon) {
            icon.textContent = appState.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }
}

// ==========================================================================
// SEÇÃO 3: GERENCIAMENTO DE NAVEGAÇÃO
// Controla navegação entre páginas e estado ativo
// ==========================================================================

class NavigationManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showPage('home');
        
        // Suporte a navegação por hash
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash && document.getElementById(hash)) {
                this.showPage(hash);
            }
        });
        
        // Carrega página inicial se houver hash
        const initialHash = window.location.hash.slice(1);
        if (initialHash && document.getElementById(initialHash)) {
            this.showPage(initialHash);
        }
    }
    
    bindEvents() {
        // Botões de navegação
        document.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.showPage(page);
                
                // Atualiza URL sem recarregar página
                if (window.history && window.history.pushState) {
                    window.history.pushState(null, null, `#${page}`);
                }
            });
        });
    }
    
    showPage(pageId) {
        // Valida se a página existe
        const targetPage = document.getElementById(pageId);
        if (!targetPage) {
            console.warn(`Página "${pageId}" não encontrada`);
            return;
        }
        
        // Esconde todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('page--active');
        });
        
        // Mostra página alvo
        targetPage.classList.add('page--active');
        
        // Atualiza navegação
        this.updateNavigation(pageId);
        appState.currentPage = pageId;
        
        // Ações específicas por página
        this.handlePageSpecificActions(pageId);
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    updateNavigation(activePageId) {
        document.querySelectorAll('.nav__item').forEach(item => {
            item.classList.remove('nav__item--active');
            if (item.getAttribute('data-page') === activePageId) {
                item.classList.add('nav__item--active');
            }
        });
    }
    
    handlePageSpecificActions(pageId) {
        switch(pageId) {
            case 'calendario':
                if (window.calendarManager) {
                    calendarManager.render();
                }
                break;
            case 'admin':
                if (window.adminManager) {
                    if (appState.isLoggedIn) {
                        adminManager.showAdminSection();
                    } else {
                        adminManager.showLoginSection();
                    }
                }
                break;
            case 'agendamento':
                if (window.formManager) {
                    // Pequeno delay para garantir que o DOM está pronto
                    setTimeout(() => {
                        formManager.setupDateInput();
                        // A atualização de horários só deve acontecer se a data for válida
                        // e será disparada pelo evento 'change' ou 'input' da data.
                        // formManager.updateHorarios();
                    }, 100);
                }
                break;
        }
    }
}

// ==========================================================================
// SEÇÃO 4: GERENCIAMENTO DE FORMULÁRIOS
// Validação, submissão e manipulação de formulários
// ==========================================================================

class FormManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.populateSelects();
        this.setupValidation();
        this.setupDateInput(); // Chama este método para configurar o input de data
    }
    
    setupDateInput() {
        const dataInput = document.getElementById('data');
        if (dataInput) {
            // Define data mínima como hoje
            const hoje = new Date();
            const hojeStr = hoje.toISOString().split('T')[0];
            dataInput.min = hojeStr;

            // Define explicitamente o valor do input de data como vazio
            // Para que o campo inicie sem uma data pré-selecionada.
            dataInput.value = ''; 
            
            // Debug
            console.log('Date input configurado:', {
                min: dataInput.min,
                value: dataInput.value, // Agora deve ser vazio
                today: hojeStr
            });
        }
    }
    
    bindEvents() {
        // Formulário de agendamento
        const agendamentoForm = document.getElementById('agendamento-form');
        if (agendamentoForm) {
            agendamentoForm.addEventListener('submit', (e) => this.handleAgendamentoSubmit(e));
        }
        
        // Mudança na data - atualiza horários
        const dataInput = document.getElementById('data');
        if (dataInput) {
            dataInput.addEventListener('change', () => {
                console.log('Data alterada para:', dataInput.value);
                this.updateHorarios();
            });
            
            // Também escuta input para capturar mudanças em tempo real
            dataInput.addEventListener('input', () => {
                console.log('Data input para:', dataInput.value);
                this.updateHorarios();
            });
        }
        
        // Formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
        }
        
        // Formatação automática de telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => this.formatTelefone(e));
        }
        
        // Filtros da tabela admin
        const filterDate = document.getElementById('filter-date');
        const filterService = document.getElementById('filter-service');
        
        if (filterDate) {
            filterDate.addEventListener('change', (e) => {
                appState.filtros.data = e.target.value;
                if (window.adminManager) {
                    adminManager.renderTable();
                }
            });
        }
        
        if (filterService) {
            filterService.addEventListener('change', (e) => {
                appState.filtros.servico = e.target.value;
                if (window.adminManager) {
                    adminManager.renderTable();
                }
            });
        }
    }
    
    populateSelects() {
        // Popula select de serviços no formulário de agendamento
        const servicoSelect = document.getElementById('servico');
        if (servicoSelect) {
            servicoSelect.innerHTML = '<option value="">Escolha o tipo de serviço</option>';
            appState.servicos.forEach(servico => {
                const option = document.createElement('option');
                option.value = servico;
                option.textContent = servico;
                servicoSelect.appendChild(option);
            });
        }
        
        // Popula filtro de serviços na admin
        const filterService = document.getElementById('filter-service');
        if (filterService) {
            filterService.innerHTML = '<option value="">Todos os serviços</option>';
            appState.servicos.forEach(servico => {
                const option = document.createElement('option');
                option.value = servico;
                option.textContent = servico;
                filterService.appendChild(option);
            });
        }
    }
    
    setupValidation() {
        // Validação em tempo real
        const inputs = document.querySelectorAll('.form__input, .form__select, .form__textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let message = '';
        
        // Validações específicas por campo
        switch(fieldName) {
            case 'cliente':
                if (!value) {
                    isValid = false;
                    message = 'Nome é obrigatório';
                } else if (value.length < 2) {
                    isValid = false;
                    message = 'Nome deve ter pelo menos 2 caracteres';
                }
                break;
                
            case 'telefone':
                if (!value) {
                    isValid = false;
                    message = 'Telefone é obrigatório';
                } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value)) {
                    isValid = false;
                    message = 'Formato: (11) 99999-9999';
                }
                break;
                
            case 'email':
                if (!value) {
                    isValid = false;
                    message = 'E-mail é obrigatório';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    isValid = false;
                    message = 'E-mail inválido';
                }
                break;
                
            case 'data':
                if (!value) {
                    isValid = false;
                    message = 'Data é obrigatória';
                } else {
                    const selectedDate = new Date(value + 'T00:00:00'); // Trata como início do dia
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Zera horas para comparação de data
                    
                    if (selectedDate < today) {
                        isValid = false;
                        message = 'Data não pode ser no passado';
                    }
                }
                break;
                
            case 'horario':
                if (!value) {
                    isValid = false;
                    message = 'Horário é obrigatório';
                }
                break;
                
            case 'servico':
                if (!value) {
                    isValid = false;
                    message = 'Serviço é obrigatório';
                }
                break;
        }
        
        this.showFieldValidation(field, isValid, message);
        return isValid;
    }
    
    showFieldValidation(field, isValid, message) {
        // Remove validações anteriores
        this.clearFieldError(field);
        
        if (!isValid) {
            field.style.borderColor = 'var(--color-error)';
            
            // Adiciona mensagem de erro
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = 'var(--color-error)';
            errorDiv.style.fontSize = 'var(--font-size-sm)';
            errorDiv.style.marginTop = 'var(--space-xs)';
            errorDiv.textContent = message;
            
            field.parentNode.appendChild(errorDiv);
        } else {
            field.style.borderColor = 'var(--color-success)';
        }
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    formatTelefone(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
        }
        
        e.target.value = value;
    }
    
    updateHorarios() {
        const dataInput = document.getElementById('data');
        const horarioSelect = document.getElementById('horario');
        
        if (!dataInput || !horarioSelect) {
            console.log('Elementos não encontrados:', { dataInput: !!dataInput, horarioSelect: !!horarioSelect });
            return;
        }
        
        const selectedDateString = dataInput.value;
        console.log('Atualizando horários para data:', selectedDateString);
        
        // Limpa opções existentes
        horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
        
        if (!selectedDateString) {
            console.log('Nenhuma data selecionada');
            return;
        }
        
        const agendamentosNaData = appState.getAgendamentosByDate(selectedDateString);
        const horariosOcupados = agendamentosNaData.map(ag => ag.horario);
        
        console.log('Agendamentos na data:', agendamentosNaData);
        console.log('Horários ocupados:', horariosOcupados);
        
        const now = new Date();
        const todayString = now.toISOString().split('T')[0];
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const horariosDisponiveis = appState.horariosDisponiveis.filter(horario => {
            const [h, m] = horario.split(':').map(Number);
            const isOccupied = horariosOcupados.includes(horario);

            // Verifica se a data selecionada é hoje e se o horário já passou
            const isPastHourToday = selectedDateString === todayString &&
                                    (h < currentHour || (h === currentHour && m <= currentMinute));
            
            return !isOccupied && !isPastHourToday;
        });
        
        console.log('Horários disponíveis:', horariosDisponiveis);
        
        if (horariosDisponiveis.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhum horário disponível';
            option.disabled = true;
            horarioSelect.appendChild(option);
        } else {
            horariosDisponiveis.forEach(horario => {
                const option = document.createElement('option');
                option.value = horario;
                option.textContent = horario;
                horarioSelect.appendChild(option);
            });
        }
    }
    
    handleAgendamentoSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const agendamento = {
            cliente: formData.get('cliente').trim(),
            telefone: formData.get('telefone').trim(),
            email: formData.get('email').trim(),
            data: formData.get('data'),
            horario: formData.get('horario'),
            servico: formData.get('servico'),
            observacoes: formData.get('observacoes').trim() || ''
        };
        
        console.log('Dados do agendamento:', agendamento);
        
        // Validação completa do formulário
        if (!this.validateAgendamento(agendamento)) {
            return;
        }
        
        // Verifica disponibilidade novamente
        const agendamentosNaData = appState.getAgendamentosByDate(agendamento.data);
        const horariosOcupados = agendamentosNaData.map(ag => ag.horario);
        
        if (horariosOcupados.includes(agendamento.horario)) {
            if (window.toastManager) {
                toastManager.show('Horário já foi agendado por outro cliente', 'error');
            }
            this.updateHorarios();
            return;
        }
        
        // Adiciona agendamento
        appState.addAgendamento(agendamento);
        
        // Feedback de sucesso
        if (window.modalManager) {
            modalManager.show(
                '✨ Agendamento Confirmado!',
                `Olá ${agendamento.cliente}! Seu agendamento foi confirmado para ${this.formatDate(agendamento.data)} às ${agendamento.horario}.\n\nServiço: ${agendamento.servico}\n\nEntraremos em contato em breve para confirmar os detalhes.`,
                () => {
                    e.target.reset();
                    this.setupDateInput(); // Redefine data padrão
                    if (window.navigationManager) {
                        navigationManager.showPage('calendario');
                    }
                }
            );
        }
        
        if (window.toastManager) {
            toastManager.show('Agendamento realizado com sucesso!', 'success');
        }
    }
    
    validateAgendamento(agendamento) {
        const required = ['cliente', 'telefone', 'email', 'data', 'horario', 'servico'];
        
        for (let field of required) {
            if (!agendamento[field]) {
                if (window.toastManager) {
                    toastManager.show(`Campo "${this.getFieldLabel(field)}" é obrigatório`, 'error');
                }
                return false;
            }
        }
        
        // Validações específicas
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agendamento.email)) {
            if (window.toastManager) {
                toastManager.show('E-mail inválido', 'error');
            }
            return false;
        }
        
        if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(agendamento.telefone)) {
            if (window.toastManager) {
                toastManager.show('Telefone inválido', 'error');
            }
            return false;
        }
        
        const selectedDate = new Date(agendamento.data + 'T00:00:00'); // Trata como início do dia
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zera horas para comparação de data
        
        if (selectedDate < today) {
            if (window.toastManager) {
                toastManager.show('Data não pode ser no passado', 'error');
            }
            return false;
        }
        
        return true;
    }
    
    getFieldLabel(field) {
        const labels = {
            cliente: 'Nome',
            telefone: 'Telefone',
            email: 'E-mail',
            data: 'Data',
            horario: 'Horário',
            servico: 'Serviço'
        };
        return labels[field] || field;
    }
    
    handleLoginSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const usuario = formData.get('usuario').trim();
        const senha = formData.get('senha');
        
        if (usuario === appState.login.usuario && senha === appState.login.senha) {
            appState.isLoggedIn = true;
            if (window.adminManager) {
                adminManager.showAdminSection();
            }
            if (window.toastManager) {
                toastManager.show('Login realizado com sucesso! 🚀', 'success');
            }
            e.target.reset();
        } else {
            if (window.toastManager) {
                toastManager.show('Usuário ou senha incorretos', 'error');
            }
            
            // Adiciona efeito de shake no formulário
            const loginCard = document.querySelector('.login-card');
            if (loginCard) {
                loginCard.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    loginCard.style.animation = '';
                }, 500);
            }
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// ==========================================================================
// SEÇÃO 5: GERENCIAMENTO DO CALENDÁRIO
// Renderização e navegação do calendário visual
// ==========================================================================

class CalendarManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousMonth());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextMonth());
        }
    }
    
    render() {
        this.updateTitle();
        this.renderGrid();
    }
    
    updateTitle() {
        const title = document.getElementById('calendar-title');
        if (title) {
            const monthNames = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            title.textContent = `${monthNames[appState.currentMonth]} ${appState.currentYear}`;
        }
    }
    
    renderGrid() {
        const grid = document.getElementById('calendar-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        // Cabeçalho dos dias da semana
        const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar__day calendar__day--header';
            dayElement.textContent = day;
            grid.appendChild(dayElement);
        });
        
        // Calcula datas do calendário
        const firstDay = new Date(appState.currentYear, appState.currentMonth, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        // Renderiza 42 dias (6 semanas)
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar__day';
            dayElement.textContent = currentDate.getDate();
            
            // Classes baseadas na data
            if (currentDate.getMonth() !== appState.currentMonth) {
                dayElement.classList.add('calendar__day--other-month');
            }
            
            const dateString = currentDate.toISOString().split('T')[0];
            const agendamentosNaData = appState.getAgendamentosByDate(dateString);
            const isPast = currentDate < hoje;
            
            if (isPast) {
                dayElement.classList.add('calendar__day--past');
            } else if (agendamentosNaData.length > 0) {
                dayElement.classList.add('calendar__day--booked');
            } else {
                dayElement.classList.add('calendar__day--available');
            }
            
            // Destaca o dia atual
            if (currentDate.toDateString() === hoje.toDateString()) {
                dayElement.style.fontWeight = 'bold';
                dayElement.style.background = 'var(--color-primary-light)';
                dayElement.style.color = 'var(--color-primary)';
            }
            
            // Click handler para todos os dias dentro do mês atual
            // para que até dias sem agendamento possam abrir o modal informativo
            if (currentDate.getMonth() === appState.currentMonth) {
                dayElement.style.cursor = 'pointer';
                dayElement.addEventListener('click', () => {
                    this.handleDayClick(dateString);
                });
            }
            
            grid.appendChild(dayElement);
        }
    }
    
    handleDayClick(dateString) {
        const agendamentosNaData = appState.getAgendamentosByDate(dateString);
        const dateObj = new Date(dateString + 'T00:00:00'); // Cria um objeto Date para formatação
        const formattedDateFull = dateObj.toLocaleDateString('pt-BR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        const formattedDateShort = dateObj.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });

        let title = '';
        let message = '';

        if (agendamentosNaData.length > 0) {
            title = `Agendamentos em ${formattedDateShort}`;
            message = `**Temos ${agendamentosNaData.length} agendamento(s) para ${formattedDateFull}:**\n\n`; // Título negrito e contagem

            agendamentosNaData.sort((a, b) => a.horario.localeCompare(b.horario)); // Ordena por hora
            agendamentosNaData.forEach(ag => {
                message += `Horário: ${ag.horario}h\n`;
                message += `Nome completo: ${ag.cliente}\n`;
                message += `Serviço: ${ag.servico}\n`;
                if (ag.observacoes) {
                    message += `Observações: ${ag.observacoes}\n`;
                }
                message += '\n'; // Adiciona uma linha em branco entre agendamentos
            });
        } else {
            title = `Nenhum agendamento em ${formattedDateShort}`;
            message = `Nenhum agendamento para ${formattedDateFull}.`;
        }

        if (window.modalManager) {
            modalManager.show(
                title,
                message,
                null, // Não há ação de confirmação padrão para este modal informativo
                { confirmText: 'Fechar', cancelText: 'Agendar', type: 'info' } // Customiza botões
            );

            // Re-adiciona os event listeners para garantir que funcionem corretamente
            // e evitem múltiplos listeners no mesmo botão.
            const modalCancelButton = document.getElementById('modal-cancel');
            if (modalCancelButton) {
                const newCancelButton = modalCancelButton.cloneNode(true);
                modalCancelButton.parentNode.replaceChild(newCancelButton, modalCancelButton);
                newCancelButton.addEventListener('click', () => {
                    if (window.navigationManager) {
                        navigationManager.showPage('agendamento');
                        setTimeout(() => {
                            const dataInput = document.getElementById('data');
                            if (dataInput) {
                                dataInput.value = dateString;
                                if (window.formManager) {
                                    formManager.updateHorarios();
                                }
                                const horarioSelect = document.getElementById('horario');
                                if (horarioSelect) {
                                    horarioSelect.focus();
                                }
                            }
                        }, 100);
                    }
                    modalManager.hide();
                });
            }

            const modalConfirmButton = document.getElementById('modal-confirm');
            if (modalConfirmButton) {
                const newConfirmButton = modalConfirmButton.cloneNode(true);
                modalConfirmButton.parentNode.replaceChild(newConfirmButton, modalConfirmButton);
                newConfirmButton.textContent = 'Fechar';
                newConfirmButton.className = 'btn btn--primary';
                newConfirmButton.addEventListener('click', () => {
                    modalManager.hide();
                });
            }
        }
    }
    
    previousMonth() {
        if (appState.currentMonth === 0) {
            appState.currentMonth = 11;
            appState.currentYear--;
        } else {
            appState.currentMonth--;
        }
        this.render();
    }
    
    nextMonth() {
        if (appState.currentMonth === 11) {
            appState.currentMonth = 0;
            appState.currentYear++;
        } else {
            appState.currentMonth++;
        }
        this.render();
    }
}

// ==========================================================================
// SEÇÃO 6: GERENCIAMENTO ADMINISTRATIVO
// Área administrativa com autenticação e gestão
// ==========================================================================

class AdminManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        const logoutBtn = document.getElementById('logout');
        const exportBtn = document.getElementById('export-csv');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportCSV());
        }
    }
    
    showLoginSection() {
        const loginSection = document.getElementById('login-section');
        const adminSection = document.getElementById('admin-section');
        
        if (loginSection) loginSection.style.display = 'flex';
        if (adminSection) adminSection.style.display = 'none';
    }
    
    showAdminSection() {
        const loginSection = document.getElementById('login-section');
        const adminSection = document.getElementById('admin-section');
        
        if (loginSection) loginSection.style.display = 'none';
        if (adminSection) adminSection.style.display = 'block';
        
        this.updateStats();
        this.renderTable();
    }
    
    updateStats() {
        const stats = appState.getStats();
        
        const totalEl = document.getElementById('total-agendamentos');
        const hojeEl = document.getElementById('agendamentos-hoje');
        const semanaEl = document.getElementById('agendamentos-semana');
        
        if (totalEl) this.animateNumber(totalEl, stats.total);
        if (hojeEl) this.animateNumber(hojeEl, stats.hoje);
        if (semanaEl) this.animateNumber(semanaEl, stats.semana);
    }
    
    animateNumber(element, targetNumber) {
        const startNumber = parseInt(element.textContent) || 0;
        const duration = 1000;
        const stepTime = 50;
        const steps = duration / stepTime;
        const increment = (targetNumber - startNumber) / steps;
        
        let currentNumber = startNumber;
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentNumber);
        }, stepTime);
    }
    
    renderTable() {
        const tbody = document.getElementById('agendamentos-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const agendamentos = appState.getAgendamentosFiltered();
        
        if (agendamentos.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="6" style="text-align: center; padding: var(--space-xl); color: var(--color-text-muted);">
                    Nenhum agendamento encontrado
                </td>
            `;
            tbody.appendChild(row);
            return;
        }
        
        agendamentos.forEach(agendamento => {
            const row = document.createElement('tr');
            
            const dataFormatada = this.formatDate(agendamento.data);
            const statusClass = this.getStatusClass(agendamento);
            const isToday = agendamento.data === new Date().toISOString().split('T')[0];
            
            row.innerHTML = `
                <td>
                    <div style="font-weight: var(--font-weight-medium);">${agendamento.cliente}</div>
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">${agendamento.email}</div>
                </td>
                <td>
                    <div>${agendamento.telefone}</div>
                </td>
                <td>
                    <div style="font-weight: var(--font-weight-medium); ${isToday ? 'color: var(--color-primary);' : ''}">${dataFormatada}</div>
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">${agendamento.horario}</div>
                </td>
                <td>
                    <div style="font-weight: var(--font-weight-medium);">${agendamento.servico}</div>
                    ${agendamento.observacoes ? `<div style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--space-xs);">${agendamento.observacoes}</div>` : ''}
                </td>
                <td>
                    <span class="status ${statusClass}">${this.getStatusText(agendamento)}</span>
                </td>
                <td class="table__actions">
                    <button class="btn btn--small btn--outline" onclick="adminManager.removeAgendamento(${agendamento.id})" title="Excluir agendamento" style="color: var(--color-error); border-color: var(--color-error);">
                        🗑️
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    getStatusClass(agendamento) {
        const hoje = new Date().toISOString().split('T')[0];
        const agendamentoDate = agendamento.data;
        
        if (agendamentoDate < hoje) {
            return 'status--info';
        } else if (agendamentoDate === hoje) {
            return 'status--warning';
        } else {
            return 'status--success';
        }
    }
    
    getStatusText(agendamento) {
        const hoje = new Date().toISOString().split('T')[0];
        const agendamentoDate = agendamento.data;
        
        if (agendamentoDate < hoje) {
            return 'Finalizado';
        } else if (agendamentoDate === hoje) {
            return 'Hoje';
        } else {
            return 'Agendado';
        }
    }
    
    removeAgendamento(id) {
        const agendamento = appState.agendamentos.find(ag => ag.id === id);
        if (!agendamento) return;
        
        if (window.modalManager) {
            modalManager.show(
                '⚠️ Confirmar Exclusão',
                `Tem certeza que deseja excluir o agendamento de "${agendamento.cliente}" para ${this.formatDate(agendamento.data)} às ${agendamento.horario}?\n\nEsta ação não pode ser desfeita.`,
                () => {
                    appState.removeAgendamento(id);
                    this.renderTable();
                    this.updateStats();
                    if (window.toastManager) {
                        toastManager.show('Agendamento excluído com sucesso', 'success');
                    }
                }
            );
        }
    }
    
    logout() {
        if (window.modalManager) {
            modalManager.show(
                '🚪 Confirmar Logout',
                'Tem certeza que deseja sair da área administrativa?',
                () => {
                    appState.isLoggedIn = false;
                    appState.filtros = { data: '', servico: '' };
                    this.showLoginSection();
                    if (window.toastManager) {
                        toastManager.show('Logout realizado com sucesso', 'success');
                    }
                    
                    // Limpa filtros
                    const filterDate = document.getElementById('filter-date');
                    const filterService = document.getElementById('filter-service');
                    if (filterDate) filterDate.value = '';
                    if (filterService) filterService.value = '';
                }
            );
        }
    }
    
    exportCSV() {
        const agendamentos = appState.getAgendamentosFiltered();
        
        if (agendamentos.length === 0) {
            if (window.toastManager) {
                toastManager.show('Nenhum agendamento para exportar', 'warning');
            }
            return;
        }
        
        const headers = [
            'ID', 'Cliente', 'Telefone', 'Email', 'Data', 'Horário', 
            'Serviço', 'Observações', 'Status', 'Criado em'
        ];
        
        const rows = agendamentos.map(ag => [
            ag.id,
            ag.cliente,
            ag.telefone,
            ag.email,
            ag.data,
            ag.horario,
            ag.servico,
            ag.observacoes || '',
            this.getStatusText(ag),
            new Date(ag.createdAt).toLocaleString('pt-BR')
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        
        // Adiciona BOM para caracteres especiais
        const bom = '\uFEFF';
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const fileName = `agendamentos_${new Date().toISOString().split('T')[0]}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        if (window.toastManager) {
            toastManager.show(`CSV exportado: ${agendamentos.length} registros`, 'success');
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR');
    }
}

// ==========================================================================
// SEÇÃO 7: GERENCIAMENTO DE MODAIS
// Sistema de modais para confirmações e alertas
// ==========================================================================

class ModalManager {
    constructor() {
        this.modal = document.getElementById('modal');
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        if (!this.modal) return;
        
        const closeBtn = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('modal-cancel');
        const backdrop = this.modal.querySelector('.modal__backdrop');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hide());
        }
        
        if (backdrop) {
            backdrop.addEventListener('click', () => this.hide());
        }
        
        // ESC key para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hide();
            }
        });
    }
    
    show(title, message, onConfirm = null, options = {}) {
        if (!this.modal) return;
        
        const {
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            type = 'default'
        } = options;
        
        const titleEl = document.getElementById('modal-title');
        const messageEl = document.getElementById('modal-message');
        let confirmBtn = document.getElementById('modal-confirm'); // Use let
        let cancelBtn = document.getElementById('modal-cancel');   // Use let
        
        if (titleEl) titleEl.textContent = title;
        if (messageEl) {
            messageEl.style.whiteSpace = 'pre-wrap'; // Mantém para quebras de linha
            // Substitui **texto** por <strong>texto</strong> para negrito
            // Esta é uma substituição simples, não um parser de markdown completo.
            const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            messageEl.innerHTML = formattedMessage; // Usa innerHTML para renderizar a tag <strong>
        }
        
        // Clonar e substituir botões para remover listeners antigos
        if (confirmBtn) {
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            confirmBtn = newConfirmBtn; // Atualiza a referência
        } else {
            // Se o botão não existir, cria um (improvável com o HTML fornecido)
            confirmBtn = document.createElement('button');
            confirmBtn.id = 'modal-confirm';
            confirmBtn.classList.add('btn');
            document.querySelector('.modal__footer').appendChild(confirmBtn);
        }

        if (cancelBtn) {
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            cancelBtn = newCancelBtn; // Atualiza a referência
        } else {
            // Se o botão não existir, cria um
            cancelBtn = document.createElement('button');
            cancelBtn.id = 'modal-cancel';
            cancelBtn.classList.add('btn', 'btn--outline');
            document.querySelector('.modal__footer').insertBefore(cancelBtn, confirmBtn);
        }

        // Configura textos e classes dos botões
        if (confirmBtn) {
            confirmBtn.textContent = confirmText;
            confirmBtn.className = `btn ${type === 'danger' ? 'btn--outline' : 'btn--primary'}`;
            if (type === 'danger') {
                confirmBtn.style.color = 'var(--color-error)';
                confirmBtn.style.borderColor = 'var(--color-error)';
            }
        }
        
        if (cancelBtn) {
            cancelBtn.textContent = cancelText;
        }
        
        // Handle confirm action
        if (onConfirm && confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                onConfirm();
                this.hide();
            });
        } else if (confirmBtn) {
            // Se não houver onConfirm, o botão 'Confirmar' apenas fecha o modal
            confirmBtn.addEventListener('click', () => {
                this.hide();
            });
        }
        
        // Por padrão, o botão de cancelar apenas fecha o modal, a menos que seja reatribuído externamente.
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        this.modal.classList.add('modal--active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Foca no primeiro elemento focável
        setTimeout(() => {
            const firstFocusable = this.modal.querySelector('button');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
    }
    
    hide() {
        if (!this.modal) return;
        
        this.modal.classList.remove('modal--active');
        this.isOpen = false;
        document.body.style.overflow = '';
    }
}

// ==========================================================================
// SEÇÃO 8: GERENCIAMENTO DE NOTIFICAÇÕES
// Sistema de toast notifications
// ==========================================================================

class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = [];
    }
    
    show(message, type = 'info', duration = 4000) {
        if (!this.container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        toast.appendChild(messageEl);
        
        // Botão de fechar
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: var(--space-xs);
            right: var(--space-xs);
            background: none;
            border: none;
            font-size: var(--font-size-lg);
            cursor: pointer;
            color: var(--color-text-muted);
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        closeBtn.addEventListener('click', () => this.remove(toast));
        toast.appendChild(closeBtn);
        
        toast.style.position = 'relative';
        toast.style.paddingRight = 'var(--space-xl)';
        
        this.container.appendChild(toast);
        this.toasts.push(toast);
        
        // Auto remove
        setTimeout(() => {
            this.remove(toast);
        }, duration);
        
        // Limita número de toasts
        if (this.toasts.length > 5) {
            this.remove(this.toasts[0]);
        }
    }
    
    remove(toast) {
        if (toast && toast.parentNode) {
            toast.style.animation = 'toastSlideOut 0.3s ease-in-out forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                    this.toasts = this.toasts.filter(t => t !== toast);
                }
            }, 300);
        }
    }
}

// ==========================================================================
// SEÇÃO 9: INICIALIZAÇÃO DA APLICAÇÃO
// Ponto de entrada e configuração inicial
// ==========================================================================

class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Carrega dados salvos
        appState.loadFromStorage();
        
        // Inicializa gerenciadores
        this.initializeManagers();
        
        // Configurações iniciais
        this.setupGlobalEvents();
        this.addStylesForAnimations();
        
        console.log('🔥 Studio Tattoo App initialized successfully!');
        
        // Feedback inicial
        setTimeout(() => {
            if (window.toastManager) {
                toastManager.show('Sistema carregado com sucesso! 🎨', 'success');
            }
        }, 500);
    }
    
    initializeManagers() {
        // Ordem de inicialização é importante
        window.themeManager = new ThemeManager();
        window.modalManager = new ModalManager();
        window.toastManager = new ToastManager();
        window.formManager = new FormManager();
        window.calendarManager = new CalendarManager();
        window.adminManager = new AdminManager();
        window.navigationManager = new NavigationManager();
    }
    
    setupGlobalEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (window.themeManager) {
                    themeManager.toggle();
                }
            });
        }
        
        // Salva estado antes de sair
        window.addEventListener('beforeunload', () => {
            appState.saveToStorage();
        });
        
        // Detecta mudanças de visibilidade
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // Recarrega dados se necessário
                if (appState.isLoggedIn && window.adminManager) {
                    adminManager.updateStats();
                    adminManager.renderTable();
                }
                if (window.calendarManager) {
                    calendarManager.render();
                }
            }
        });
    }
    
    addStylesForAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes toastSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================================================
// INICIALIZAÇÃO QUANDO DOM ESTÁ PRONTO
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicia a aplicação
    window.app = new App();
    
    // Renderização inicial
    if (window.calendarManager) {
        calendarManager.render();
    }
    
    // Debug mode em desenvolvimento
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.appState = appState;
        console.log('Debug mode ativo. Use window.appState para acessar dados.');
    }
});

// ==========================================================================
// ERROR HANDLING GLOBAL
// ==========================================================================

window.addEventListener('error', (event) => {
    console.error('Erro global capturado:', event.error);
    
    if (window.toastManager) {
        toastManager.show('Ocorreu um erro inesperado. Tente novamente.', 'error');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejeitada:', event.reason);
    
    if (window.toastManager) {
        toastManager.show('Erro de conexão. Verifique sua internet.', 'error');
    }
});