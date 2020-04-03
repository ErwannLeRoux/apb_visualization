$(document).ready(function () {

    $('#schools_table').DataTable({
        "initComplete": function(settings, json) {
            $("#schools_table").show()
            $("#loader").hide()
        },
        "lengthMenu": [[25, 50, 75], [25, 50, 75]],
        "language": {
            "lengthMenu": " _MENU_ résultats par page",
            "zeroRecords": "Aucun résultat trouvé",
            "info": "_PAGE_ sur _PAGES_",
            "infoEmpty": "Aucun résultat disponible",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Rechercher : ",
            "paginate": {
              "next": "Suivant",
              "previous": "Précédent"
            }
        }
    });

    $('.dataTables_length').addClass('bs-select');
});
