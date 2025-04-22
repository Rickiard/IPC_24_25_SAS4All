using System.ComponentModel.DataAnnotations;

namespace SAS4ALL.Models
{
    public class CarregamentosViewModel
    {
        [Required]
        [Phone]
        [Display(Name = "Número de telemóvel")]
        public string Telemovel { get; set; }

        [Required]
        [Range(5, 250)]
        [Display(Name = "Valor (€)")]
        public decimal Valor { get; set; }
    }
}

