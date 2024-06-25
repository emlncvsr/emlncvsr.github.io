// Chemin du dossier contenant les images
var folderPath = "C:/Mega/Sites/geijutsu.site/vsco/assets/img/secret-original";

// Dossier de destination pour enregistrer les images
var destinationFolder = "C:/Users/kevan/Desktop/New folder";

// Largeur maximale souhaitée
var maxWidth = 600;

// Qualité de l'image (de 0 à 12, 6 semble être votre choix)
var quality = 6;

// Obtenir la liste des fichiers dans le dossier
var fileList = Folder(folderPath).getFiles();

// Boucle à travers chaque fichier
for (var i = 0; i < fileList.length; i++) {
  var file = fileList[i];

  // Vérifier si le fichier est une image
  if (file instanceof File && /\.(jpg|jpeg|gif|png)$/i.test(file.name)) {
    // Ouvrir l'image dans Photoshop
    var doc = app.open(file);

    // Redimensionner l'image en maintenant la proportion d'origine
    if (doc.width > maxWidth) {
      var newWidth = maxWidth;
      var newHeight = (maxWidth / doc.width) * doc.height;
      doc.resizeImage(newWidth, newHeight);
    }

    // Enregistrer l'image avec la qualité spécifiée
    var options = new ExportOptionsSaveForWeb();
    options.quality = quality;

    // Utiliser le même format que l'original
    options.format = /\.(gif|png)$/i.test(file.name) ? SaveDocumentType.PNG : SaveDocumentType.JPEG;

    var destinationFile = new File(destinationFolder + "/" + file.name);
    doc.exportDocument(destinationFile, ExportType.SAVEFORWEB, options);

    // Fermer l'image sans enregistrer les modifications
    doc.close(SaveOptions.DONOTSAVECHANGES);
  }
}

// Informer que le traitement est terminé
alert("Traitement terminé. Les images ont été redimensionnées et enregistrées avec succès dans le dossier de destination.");
