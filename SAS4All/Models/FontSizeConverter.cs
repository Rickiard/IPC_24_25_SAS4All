using Newtonsoft.Json;
using System;

namespace SAS4All.Models
{
    public class FontSizeConverter : JsonConverter<double>
    {
        public override double ReadJson(JsonReader reader, Type objectType, double existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            if (reader.Value == null)
                return 16;

            // Handle string values (legacy format with "px")
            if (reader.Value is string stringValue)
            {
                stringValue = stringValue.Replace("px", "").Trim();
                if (double.TryParse(stringValue, out double result))
                    return result;
                return 16;
            }

            // Handle numeric values (new format)
            if (reader.Value is double doubleValue)
                return doubleValue;

            return 16; // Default value if parsing fails
        }

        public override void WriteJson(JsonWriter writer, double value, JsonSerializer serializer)
        {
            writer.WriteValue(value);
        }
    }
}
