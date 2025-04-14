using System.Collections.Generic;

namespace SAS4All.Models
{
    public class AcessibilidadeModel
    {
        // Configurações de acessibilidade
        public bool ModoEscuro { get; set; }
        public bool AltoContraste { get; set; }
        public string TamanhoFonte { get; set; }
        public string Espacamento { get; set; }
        public bool TemasPredefinidos { get; set; }
        public bool FeedbackAuditivo { get; set; }
        public bool ComandosVoz { get; set; }

        // Configuração de atalhos
        public Dictionary<string, string> Atalhos { get; set; }

        public AcessibilidadeModel()
        {
            Atalhos = new Dictionary<string, string>
            {
                { "Página Principal", "" },
                { "Alteração do PIN", "" },
                { "Acessibilidade", "" },
                { "Movimentos", "" },
                { "Refeicões", "" },
                { "Perfil", "" },
                { "Carregamentos", "" }
            };
        }
    }
}
