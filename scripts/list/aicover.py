from google.colab import output
import time

# Fonction pour envoyer des sorties régulières pour maintenir la session active
def keep_alive():
    while True:
        output.eval_js('google.colab.kernel.proxyPort(9999)')
        time.sleep(10)

# Appelez la fonction pour maintenir la session active
keep_alive()
