using Newtonsoft.Json;

namespace Module.IOTemplate.Api.Processor.Example.Data
{
    /// <summary>
    /// 
    /// </summary>
    public class Config
    {
        /// <summary>
        /// 
        /// </summary>
        public Config()
        {
            TextValue = string.Empty;
            CollectionValue = [];
        }

        /// <value>
        /// 
        /// </value>
        [JsonProperty("text_value")]
        public string TextValue
        {
            get;
            set;
        }

        /// <value>
        /// 
        /// </value>
        [JsonProperty("number_value")]
        public int NumberValue
        {
            get;
            set;
        }

        /// <value>
        /// 
        /// </value>
        [JsonProperty("collection_value")]
        public List<string> CollectionValue
        {
            get;
            set;
        }

        /// <value>
        /// 
        /// </value>
        [JsonProperty("boolean_value")]
        public bool BooleanValue
        {
            get;
            set;
        }

        /// <value>
        /// 
        /// </value>
        [JsonProperty("login_profile")]
        public string LoginProfile
        {
            get;
            set;
        }
    }
}