using System.Collections.Generic;
using Newtonsoft.Json;

namespace SAS4All.Models
{
    public class AcessibilidadeModel
    {
        // Configurações de acessibilidade
        public bool ModoEscuro { get; set; }
        public bool AltoContraste { get; set; }        
        
        [JsonConverter(typeof(FontSizeConverter))]
        public double TamanhoFonte { get; set; } = 16; // Default font size in pixels
        
        public string Espacamento { get; set; } = "normal"; // Default spacing value
    }
}
